import { NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import {
  authenticateTokenFromCookies,
  refreshToken,
} from "../service/AuthenticationService";

export const authenticateRequest = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      try {
        const jwtPayload = jwt.verify(token, JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
        return next();
      } catch (error) {}
    }

    try {
      await authenticateTokenFromCookies(req, res);
      return next();
    } catch (error) {
      if (error.message === "Unauthorized") {
        return res.status(401).send("Unauthorized: Token validation failed.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).send("Internal server error.");
  }
};
