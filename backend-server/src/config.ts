require("dotenv").config();

export const port = process.env.PORT || 8080;
export const testPort = process.env.TEST_PORT || 8081;
export const COMMON_RATE_LIMIT_MAX_REQUESTS =
  process.env.COMMON_RATE_LIMIT_MAX_REQUESTS || 1000;
export const COMMON_RATE_LIMIT_WINDOW_MS =
  process.env.COMMON_RATE_LIMIT_WINDOW_MS || 1000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || `http://localhost:3000`;
export const JWT_SECRET = process.env.JWT_SECRET || "asdsadsad";
