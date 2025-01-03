import { Request, Response, NextFunction } from "express";

const MAX_ATTEMPTS = 10; // Maximum number of allowed login attempts
const BLOCK_DURATION_MINUTES = 15; // Block duration in minutes
const BLOCK_DURATION_MS = BLOCK_DURATION_MINUTES * 60 * 1000; // Convert minutes to milliseconds

export const bruteForceProtection = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  const attempts: { [ip: string]: { count: number; blockUntil: number } } = {};

  if (req.method === "POST" && req.path === "/login") {
    const ip = req.ip;
    const currentTime = Date.now();

    if (!attempts[ip]) {
      attempts[ip] = { count: 0, blockUntil: 0 };
    }

    const userAttempts = attempts[ip];

    // Check if IP is currently blocked
    if (userAttempts.blockUntil > currentTime) {
      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
      });
    }

    // Increment attempt count for this IP
    userAttempts.count += 1;

    // Block if maximum attempts exceeded
    if (userAttempts.count > MAX_ATTEMPTS) {
      userAttempts.blockUntil = currentTime + BLOCK_DURATION_MS;
      userAttempts.count = 0; // Reset count after blocking
      return res.status(429).json({
        message: "Too many login attempts. Please try again in 15 minutes.",
      });
    }

    return next();
  } else {
    return next();
  }
};

export default bruteForceProtection;
