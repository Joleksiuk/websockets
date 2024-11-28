import { body, param } from "express-validator";
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";
import { RoomController } from "./controller/RoomController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "getAll",
    validation: [],
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "getById",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "createNewUser",
    validation: [
      body("username").isString().withMessage("username must be a string"),
      body("password").isString().withMessage("password must be a string"),
      body("role").isString().withMessage("role must be a string"),
    ],
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "deleteUser",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "post",
    route: "/login",
    controller: AuthController,
    action: "login",
    validation: [
      body("username").isString().withMessage("username must be a string"),
      body("password").isString().withMessage("password must be a string"),
    ],
  },
  {
    method: "get",
    route: "/myself",
    controller: AuthController,
    action: "myself",
  },
  {
    method: "post",
    route: "/refreshToken",
    controller: AuthController,
    action: "refreshToken",
  },
  {
    method: "post",
    route: "/logout",
    controller: AuthController,
    action: "logout",
  },
  {
    method: "post",
    route: "/changePassword",
    controller: AuthController,
    action: "changePassword",
    validation: [
      body("oldPassword")
        .isString()
        .withMessage("oldPassword must be a string"),
      body("newPassword")
        .isString()
        .withMessage("newPassword must be a string"),
    ],
  },
  {
    method: "post",
    route: "/rooms",
    controller: RoomController,
    action: "createRoom",
    validation: [body("name").isString().withMessage("name must be a string")],
  },
  {
    method: "delete",
    route: "/rooms/:id",
    controller: RoomController,
    action: "deleteRoom",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "get",
    route: "/rooms/:id",
    controller: RoomController,
    action: "findRoomById",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
];
