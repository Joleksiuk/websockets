import type { Request } from "express";
import { rateLimit } from "express-rate-limit";
import {
  COMMON_RATE_LIMIT_MAX_REQUESTS,
  COMMON_RATE_LIMIT_WINDOW_MS,
} from "../config";

//5000 requests per 15 minutes
const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: Number(COMMON_RATE_LIMIT_MAX_REQUESTS),
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  windowMs: 15 * 60 * Number(COMMON_RATE_LIMIT_WINDOW_MS),
  keyGenerator: (req: Request) => req.ip as string,
});

export default rateLimiter;
