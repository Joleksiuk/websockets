import { AppDataSource } from "../data-source";
import { Room } from "../entity/Room";

export const findRoomById = async (roomId: string): Promise<Room> => {
  const roomFromDB = await AppDataSource.getRepository(Room).findOne({
    where: { id: Number(roomId) },
    relations: ["authorizedUsers"],
  });

  return roomFromDB;
};
