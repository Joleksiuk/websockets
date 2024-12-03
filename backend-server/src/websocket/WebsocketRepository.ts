import { AppDataSource } from "../data-source";
import { Room } from "../entity/Room";
import { User } from "../entity/User";

export const findRoomById = async (roomId: string): Promise<Room> => {
  const roomFromDB = await AppDataSource.getRepository(Room).findOne({
    where: { id: Number(roomId) },
    relations: ["authorizedUsers"],
  });

  return roomFromDB;
};

export const findUserById = async (userId: number) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
  });
  return user;
};
