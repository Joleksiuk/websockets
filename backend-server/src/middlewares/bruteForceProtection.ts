import { Request, Response, NextFunction } from "express";

const MAX_ATTEMPTS = 10; // Maximum number of allowed login attempts
const BLOCK_DURATION_MINUTES = 15; // Block duration in minutes
const BLOCK_DURATION_MS = BLOCK_DURATION_MINUTES * 60 * 1000; // Convert minutes to milliseconds

const ipAttempts: { [ip: string]: { count: number; blockUntil: number } } = {};
const userAttempts: {
  [username: string]: { count: number; blockUntil: number };
} = {};

export const bruteForceProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Brute force protection middleware");

  if (req.method === "POST" && req.path === "/login") {
    const ip = req.ip;
    const currentTime = Date.now();
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    if (!ipAttempts[ip]) {
      ipAttempts[ip] = { count: 0, blockUntil: 0 };
    }

    if (!userAttempts[username]) {
      userAttempts[username] = { count: 0, blockUntil: 0 };
    }

    const ipData = ipAttempts[ip];
    const userData = userAttempts[username];

    console.log("IP attempts: ", ipData);
    console.log("User attempts: ", userData);

    if (ipData.blockUntil > currentTime) {
      return res.status(429).json({
        message:
          "Too many login attempts from this IP. Please try again later.",
      });
    }

    if (userData.blockUntil > currentTime) {
      return res.status(429).json({
        message:
          "Too many login attempts for this account. Please try again later.",
      });
    }

    ipData.count += 1;
    userData.count += 1;

    if (ipData.count > MAX_ATTEMPTS) {
      ipData.blockUntil = currentTime + BLOCK_DURATION_MS;
      ipData.count = 0;
      return res.status(429).json({
        message:
          "Too many login attempts from this IP. Please try again in 15 minutes.",
      });
    }

    if (userData.count > MAX_ATTEMPTS) {
      userData.blockUntil = currentTime + BLOCK_DURATION_MS;
      userData.count = 0;
      return res.status(429).json({
        message:
          "Too many login attempts for this account. Please try again in 15 minutes.",
      });
    }

    return next();
  } else {
    return next();
  }
};

export default bruteForceProtection;
