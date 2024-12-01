import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { COOKIE_ROOMS_KEY } from "../config";

export class RoomController {
  private roomRepository = AppDataSource.getRepository(Room);
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

  generatePassword(): string {
    return Math.random().toString(36).slice(2);
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
    const password = this.generatePassword();
    const room = new Room();
    room.name = name;
    room.owner = await this.getLoggedUser(res);
    room.password = password;
    room.createdAt = new Date();

    room.hashPassword();

    const errors = await validate(room);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await this.roomRepository.save(room);
      const data = {
        id: room.id,
        name: room.name,
        ownerId: room.owner.id,
      };
      res
        .cookie(
          `${COOKIE_ROOMS_KEY}_${room.id}`,
          { id: room.id, password },
          { httpOnly: true, sameSite: "strict", signed: true }
        )
        .status(201)
        .send(data);
      return data;
    } catch (error) {
      res.status(500).send("Error creating room");
      console.error(error);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);

    try {
      const room = await this.roomRepository.findOneOrFail({
        where: { id: roomId },
      });
      await this.roomRepository.delete(roomId);
      res.status(204).send();
    } catch (error) {
      res.status(404).send("Room not found");
    }
  }

  async addUserToRoom(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);
    const { userId } = req.body;

    try {
      const room = await this.roomRepository.findOneOrFail({
        where: { id: roomId },
        relations: ["authorizedUsers"],
      });

      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });

      room.authorizedUsers.push(user);
      await this.roomRepository.save(room);

      res.status(200).send("User added to room");
    } catch (error) {
      res.status(404).send("Room or user not found");
    }
  }

  async removeUserFromRoom(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);
    const { userId } = req.body;

    try {
      const room = await this.roomRepository.findOneOrFail({
        where: { id: roomId },
        relations: ["authorizedUsers"],
      });

      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });

      room.authorizedUsers = room.authorizedUsers.filter(
        (authorizedUser) => authorizedUser.id !== user.id
      );
      await this.roomRepository.save(room);

      res.status(200).send("User removed from room");
    } catch (error) {
      res.status(404).send("Room not found");
    }
  }

  async findRoomById(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);

    try {
      const room: Room = await this.roomRepository.findOneOrFail({
        where: { id: roomId },
        relations: ["owner", "authorizedUsers"],
      });

      const loggedUser = await this.getLoggedUser(res);
      const isAuthorized = room.authorizedUsers.some(
        (user) => user.id === loggedUser.id
      );

      const isOwner = room.owner.id === loggedUser.id;

      if (isAuthorized || isOwner) {
        const responseData = {
          id: room.id,
          name: room.name,
          ownerId: room.owner.id,
          users: room.authorizedUsers.map((user) => {
            return {
              id: user.id,
              username: user.username,
            };
          }),
        };

        res.status(200).send(responseData);
      } else {
        res.status(401).send("Unauthorized");
      }
    } catch (error) {
      console.log(error);
      res.status(404).send("Room not found");
    }
  }
}
