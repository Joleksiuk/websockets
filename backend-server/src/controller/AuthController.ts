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
  USE_SSL,
} from "../config";
import { AppDataSource } from "../data-source";
export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

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
        secure: USE_SSL,
      })
      .cookie(COOKIE_RT_KEY, refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        signed: true,
        secure: USE_SSL,
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
}
