import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async getAll(request: Request, response: Response, next: NextFunction) {
    const users = await this.userRepository.find();
    response.send(users);
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      response.status(404).send("Unregistered user");
      return;
    }
    response.send(user);
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
      res.status(409).send("Username already in use");
      return;
    }
    res.status(201).send("User created");
  }

  async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });
      await this.userRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).send("User not found");
    }
  }

  async getAllUsersByName(req: Request, res: Response) {
    const name = req.query.name;
    const users = await this.userRepository.find({
      where: { username: name },
    });

    const responseData = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
      };
    });
    res.send(responseData);
  }
}
