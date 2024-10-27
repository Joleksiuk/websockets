import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@common/utils/httpHandlers";
import express, { RequestHandler, type Router } from "express";
import { createApiResponse } from "src/api-docs/openAPIResponseBuilders";
import { z } from "zod";
import { userController } from "./userController";
import { UserSchema, GetUserSchema } from "./userModel";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get(
  "/:id",
  validateRequest(GetUserSchema) as RequestHandler,
  userController.getUser
);
