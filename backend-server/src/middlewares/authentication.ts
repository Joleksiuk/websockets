import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import {
  authenticateTokenFromCookies,
  refreshToken,
} from "../service/AuthenticationService";

export const authenticateRequest = async (
  req: Request,
  res: Response,
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
      throw error; // Unhandled error
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).send("Internal server error.");
  }
};

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return;
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7, authHeader.length)
    : authHeader;

  try {
    const jwtPayload = jwt.verify(token, JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
