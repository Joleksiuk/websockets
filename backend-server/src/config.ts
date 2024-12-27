require("dotenv").config();

// export const USE_SSL = process.env.USE_SSL || true;
export const USE_SSL = false;
export const LOCAL_SERVER = process.env.RENDER ? false : true;

export const PROTOCOLE = USE_SSL ? "https" : "http";

export const PORT = process.env.PORT || 8082;
export const HOST_PERFIX = "localhost";

export const BACKEND_HOST_NAME =
  process.env.BACKEND_HOST_NAME || `${HOST_PERFIX}:${PORT}`;

export const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
export const FRONTEND_HOST_NAME =
  process.env.RENDER_EXTERNAL_HOSTNAME || `${HOST_PERFIX}:${FRONTEND_PORT}`;

export const COMMON_RATE_LIMIT_MAX_REQUESTS =
  process.env.COMMON_RATE_LIMIT_MAX_REQUESTS || 5000;
export const COMMON_RATE_LIMIT_WINDOW_MS =
  process.env.COMMON_RATE_LIMIT_WINDOW_MS || 1000;

export const JWT_SECRET = process.env.JWT_SECRET || "asdsadsad";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";
export const JWT_REFRESH_EXPIRATION =
  process.env.JWT_REFRESH_EXPIRATION || "7d";

export const COOKIE_SECRET = process.env.COOKIE_SECRET || "sddfdsfsdf";
export const COOKIET_JWT_KEY = "access_token";
export const COOKIE_RT_KEY = "refresh_token";

export const NODE_ENV = process.env.NODE_ENV || "development";

export const DATABASE_HOST = process.env.DATABASE_HOST
  ? process.env.DATABASE_HOST
  : NODE_ENV === "test"
  ? "db"
  : HOST_PERFIX;

export const DATABASE_PORT = process.env.DATABASE_PORT || "5432";
export const DATABASE_USER = process.env.DATABASE_USER || "postgres";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "postgres";
export const DATABASE_NAME = process.env.DATABASE_NAME || "ws";
