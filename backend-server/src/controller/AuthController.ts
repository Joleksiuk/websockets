import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

import { User } from "../entity/User";
import {
  COOKIE_RT_KEY,
  COOKIET_JWT_KEY,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  JWT_SECRET,
} from "../config";
import { AppDataSource } from "../data-source";

type AuthCookiePayload = {
  accessToken: string;
  refreshToken: string;
};
export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async login(req: Request, res: Response) {
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    const accessToken: string = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    const refreshToken: string = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRATION }
    );

    res
      .cookie(COOKIET_JWT_KEY, accessToken, {
        httpOnly: true,
        sameSite: "strict",
        signed: true,
      })
      .cookie(COOKIE_RT_KEY, refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        signed: true,
      })
      .status(200)
      .send({
        username: user.username,
        userId: user.id,
        jwt: accessToken,
      });
  }

  async logout(req: Request, res: Response) {
    res
      .clearCookie(COOKIET_JWT_KEY)
      .clearCookie(COOKIE_RT_KEY)
      .status(204)
      .send();
  }

  async refreshToken(req, res) {
    const refresh_token = req.signedCookies[COOKIE_RT_KEY];
    if (!refresh_token) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refresh_token, JWT_SECRET);
      const newAccessToken = jwt.sign({ user: decoded.user }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });

      res
        .cookie(COOKIET_JWT_KEY, newAccessToken, {
          httpOnly: true,
          sameSite: "strict",
          signed: true,
        })
        .status(200);
    } catch (error) {
      return res.status(400).send("Invalid refresh token.");
    }
  }

  async myself(req: Request, res: Response) {
    try {
      await this.authenticateTokenFromCookies(req, res);
      const userId = res.locals.jwtPayload.userId;

      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      return res.status(200).json({
        username: user.username,
        userId,
        jwt: res.locals.jwtPayload,
      });
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  }

  async authenticateTokenFromCookies(req: Request, res: Response) {
    const access_token = req.signedCookies[COOKIET_JWT_KEY];

    if (!access_token) {
      throw new Error("Unauthorized");
    }

    try {
      const decoded = jwt.verify(access_token, JWT_SECRET);
      res.locals.jwtPayload = decoded;
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        try {
          await this.refreshToken(req, res);
        } catch (refreshError) {
          throw new Error("Unauthorized");
        }
      } else {
        throw new Error("Unauthorized");
      }
    }
  }

  async changePassword(req: Request, res: Response) {
    const id = res.locals.jwtPayload.userId;

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }
    let user: User;
    try {
      user = await this.userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    user.hashPassword();
    this.userRepository.save(user);

    res.status(204).send();
  }
}
