import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Room } from "./entity/Room";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Room],
  migrations: [],
  subscribers: [],
});
