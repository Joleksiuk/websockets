require("dotenv").config();

export const USE_SSL = process.env.RENDER || true;
export const LOCAL_SERVER = process.env.RENDER ? false : true;

export const PROTOCOLE = USE_SSL ? "https" : "http";
export const HOST_NAME =
  process.env.RENDER_EXTERNAL_HOSTNAME || "localhost:3000";
export const PORT = process.env.PORT || 3000;

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

export const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
export const DATABASE_PORT = process.env.DATABASE_PORT || "5432";
export const DATABASE_USER = process.env.DATABASE_USER || "postgres";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "postgres";
export const DATABASE_NAME = process.env.DATABASE_NAME || "ws";
