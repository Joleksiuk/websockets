import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Room } from "./entity/Room";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "chatdb",
  synchronize: true,
  logging: false,
  entities: [User, Room],
  migrations: [],
  subscribers: [],
});
