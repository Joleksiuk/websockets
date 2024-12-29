import { body, param } from "express-validator";
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";
import { RoomController } from "./controller/RoomController";

export const Routes = [
  {
    method: "get",
    route: "/secure/users",
    controller: UserController,
    action: "getAll",
    validation: [],
  },
  {
    method: "get",
    route: "/secure/users/:id",
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
    method: "post",
    route: "secure/users/confirm-email",
    controller: UserController,
    action: "confirmEmail",
  },
  {
    method: "delete",
    route: "/secure/users/:id",
    controller: UserController,
    action: "deleteUser",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "get",
    route: "/secure/users",
    controller: UserController,
    action: "getAllUsersByName",
    validation: [param("name").isString().withMessage("name must be a string")],
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
    route: "/secure/myself",
    controller: AuthController,
    action: "myself",
  },
  {
    method: "post",
    route: "/secure/refreshToken",
    controller: AuthController,
    action: "refreshToken",
  },
  {
    method: "post",
    route: "/secure/logout",
    controller: AuthController,
    action: "logout",
  },
  {
    method: "post",
    route: "/secure/changePassword",
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
    route: "/secure/rooms",
    controller: RoomController,
    action: "createRoom",
    validation: [body("name").isString().withMessage("name must be a string")],
  },
  {
    method: "delete",
    route: "/secure/rooms/:id",
    controller: RoomController,
    action: "deleteRoom",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "get",
    route: "/secure/rooms/:id",
    controller: RoomController,
    action: "findRoomById",
    validation: [param("id").isInt().withMessage("id must be a number")],
  },
  {
    method: "put",
    route: "/secure/rooms/:id/users/add",
    controller: RoomController,
    action: "addUserToRoom",
    validator: [
      param("id").isInt().withMessage("id must be a number"),
      body("userId").isInt().withMessage("userId must be a number"),
    ],
  },
  {
    method: "put",
    route: "/secure/rooms/:id/users/remove",
    controller: RoomController,
    action: "removeUserFromRoom",
    validator: [
      param("id").isInt().withMessage("id must be a number"),
      body("userId").isInt().withMessage("userId must be a number"),
    ],
  },
];
