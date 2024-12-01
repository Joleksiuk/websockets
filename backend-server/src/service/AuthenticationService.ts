import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {
  COOKIE_RT_KEY,
  COOKIET_JWT_KEY,
  JWT_EXPIRATION,
  JWT_SECRET,
} from "../config";

export const authenticateTokenFromCookies = async (
  req: Request,
  res: Response
) => {
  const access_token = req.signedCookies[COOKIET_JWT_KEY];

  if (!access_token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(access_token, JWT_SECRET);
    res.locals.jwtPayload = decoded;
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      try {
        const newToken = await refreshToken(req, res);
        return newToken;
      } catch (refreshError) {
        throw new Error("Unauthorized");
      }
    } else {
      throw new Error("Unauthorized");
    }
  }

  return access_token;
};

export const refreshToken = async (req, res) => {
  const refresh_token = req.signedCookies[COOKIE_RT_KEY];
  if (!refresh_token) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refresh_token, JWT_SECRET);
    const newAccessToken = jwt.sign({ user: decoded.user }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res
      .cookie(COOKIET_JWT_KEY, newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        signed: true,
      })
      .status(200);

    return newAccessToken;
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};
