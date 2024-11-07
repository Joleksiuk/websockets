import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { checkJwt } from "../middlewares/checkJwt";

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

  async createRoom(req: Request, res: Response, next: NextFunction) {
    checkJwt(req, res, async () => {
      const { name, password } = req.body;

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
        res.status(201).send("Room created");
      } catch (error) {
        res.status(500).send("Error creating room");
        console.error(error);
      }
    });
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    checkJwt(req, res, async () => {
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
    });
  }

  async findRoomById(req: Request, res: Response, next: NextFunction) {
    checkJwt(req, res, async () => {
      const roomId = parseInt(req.params.id);

      try {
        const room = await this.roomRepository.findOneOrFail({
          where: { id: roomId },
          relations: ["owner"],
        });
        res.send(room);
      } catch (error) {
        res.status(404).send("Room not found");
      }
    });
  }
}
