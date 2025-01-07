import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

import { User } from "../entity/User";
import {
  CAPTCHA_SECRET,
  CAPTCHA_URL,
  COOKIE_RT_KEY,
  COOKIET_JWT_KEY,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  JWT_SECRET,
  USE_EMAIL_VALIDATION,
} from "../config";
import { AppDataSource } from "../data-source";
import axios from "axios";
export class AuthController {
  private readonly userRepository = AppDataSource.getRepository(User);

  async getLoggedUser(res: Response): Promise<User> {
    const jwtPayload = res.locals.jwtPayload;

    const owner: User = await this.userRepository.findOne({
      where: { id: jwtPayload.userId },
    });
    if (!owner) {
      res.status(401).send("Unauthorized user");
    }
    return owner;
  }

  async login(req: Request, res: Response) {
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ where: { username } });
      console.log(user);
    } catch (error) {
      res.status(401).send();
    }

    if (USE_EMAIL_VALIDATION && !user.isEmailConfirmed) {
      res.status(401).send("Email is not confirmed");
    }

    if (!user?.checkIfUnencryptedPasswordIsValid(password)) {
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
        sameSite: "none",
        signed: true,
        secure: true,
      })
      .cookie(COOKIE_RT_KEY, refreshToken, {
        httpOnly: true,
        sameSite: "none",
        signed: true,
        secure: true,
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

  async myself(req: Request, res: Response) {
    try {
      const userId = res.locals.jwtPayload.userId;

      const user = await this.getLoggedUser(res);

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

  async verifyCaptcha(req: Request, res: Response) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).send({ message: "CAPTCHA token is required" });
    }

    try {
      const response = await axios.post(
        CAPTCHA_URL,
        {},
        {
          params: {
            secret: CAPTCHA_SECRET,
            response: token,
          },
        }
      );

      if (response.data.success) {
        return res
          .status(200)
          .send({ message: "CAPTCHA verified successfully!" });
      } else {
        console.log(response.data);
        return res.status(400).send({ message: "CAPTCHA verification failed" });
      }
    } catch (error) {
      console.error("CAPTCHA verification error:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}
