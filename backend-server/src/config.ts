require("dotenv").config();

export const USE_SSL = false;

export const port = process.env.PORT || 8080;
export const testPort = process.env.TEST_PORT || 8081;
export const COMMON_RATE_LIMIT_MAX_REQUESTS =
  process.env.COMMON_RATE_LIMIT_MAX_REQUESTS || 1000;
export const COMMON_RATE_LIMIT_WINDOW_MS =
  process.env.COMMON_RATE_LIMIT_WINDOW_MS || 1000;
export const JWT_SECRET = process.env.JWT_SECRET || "asdsadsad";

export const COOKIE_SECRET = process.env.COOKIE_SECRET || "sddfdsfsdf";
export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24;
export const COOKIE_AT_KEY = process.env.COOKIE_AT_KEY || "at";
