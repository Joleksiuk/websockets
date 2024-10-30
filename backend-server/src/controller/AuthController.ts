import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { JWT_SECRET } from "../config";
import { AppDataSource } from "../data-source";

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

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send(token);
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
