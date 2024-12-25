import { NextFunction } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

const roles = ["admin"];

export const authorizeRequestAsAdmin = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const id = res.locals.jwtPayload.userId;

    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).send("Internal server error.");
  }
};
