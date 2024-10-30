import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async getAll(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async createNewUser(req: Request, res: Response) {
    let { username, password, role } = req.body;
    let user = new User();
    user.username = username;
    user.password = password;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();

    try {
      await this.userRepository.save(user);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    res.status(201).send("User created");
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    this.userRepository.delete(id);

    res.status(204).send();
  }
}
