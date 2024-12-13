require("dotenv").config();

export const USE_SSL = true;

export const port = process.env.PORT || 8082;
export const testPort = process.env.TEST_PORT || 8081;
export const COMMON_RATE_LIMIT_MAX_REQUESTS =
  process.env.COMMON_RATE_LIMIT_MAX_REQUESTS || 1000;
export const COMMON_RATE_LIMIT_WINDOW_MS =
  process.env.COMMON_RATE_LIMIT_WINDOW_MS || 1000;
export const JWT_SECRET = process.env.JWT_SECRET || "asdsadsad";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";
export const JWT_REFRESH_EXPIRATION =
  process.env.JWT_REFRESH_EXPIRATION || "7d";

export const COOKIE_SECRET = process.env.COOKIE_SECRET || "sddfdsfsdf";
export const COOKIET_JWT_KEY = "access_token";
export const COOKIE_RT_KEY = "refresh_token";
