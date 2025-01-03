import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";
import { BACKEND_HOST_NAME, JWT_SECRET, PROTOCOLE } from "../config";
import { generateConfirmationToken, sendEmail } from "../service/EmailService";

export class UserController {
  private readonly userRepository = AppDataSource.getRepository(User);

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

  async createNewUserAfterEmailConfirmation(req: Request, res: Response) {
    const { username, password, role, email } = req.body;

    let user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.role = role;
    user.isEmailConfirmed = false;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();
    let savedUser;

    try {
      savedUser = await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      res.status(500).send("Something wron with saving user");
      return;
    }

    try {
      const token = generateConfirmationToken(savedUser.id);

      const confirmationLink = `${PROTOCOLE}://${BACKEND_HOST_NAME}/confirm?token=${token}`;
      const subject = "Email Confirmation";
      const html = `
          <p>Hi ${username},</p>
          <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
          <a href="${confirmationLink}">Confirm Email</a>
        `;

      await sendEmail(email, subject, html, process.env.EMAIL_PASS);
      res.status(201).send("User created. Confirmation email sent.");
    } catch (e) {
      console.log(e);
      res.status(500).send("Something went wrong with sending email");
      return;
    }
  }

  async createNewUser(req: Request, res: Response) {
    let { username, password, role, email } = req.body;
    let user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.isEmailConfirmed = true;
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
      await this.userRepository.findOneOrFail({ where: { id } });
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

  async confirmEmail(req: Request, res: Response) {
    const { token } = req.query;
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Error while veryfing token", error);
      res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { userId } = jwt.verify(token, JWT_SECRET);
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      console.log(`User with ID ${userId} confirmed e-mail`);
      res.status(200).json({ message: "E-mail confirmed!" });
    } catch (error) {
      console.error("Error while veryfing token", error);
      res.status(404).json({ message: "User not found" });
    }
  }
}
