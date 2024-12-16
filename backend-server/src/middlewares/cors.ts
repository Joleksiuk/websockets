import { CorsOptions } from "cors";
import { FRONTEND_HOST_NAME, LOCAL_SERVER } from "../config";

export const corsOptions: CorsOptions = LOCAL_SERVER
  ? {
      origin: "https://" + FRONTEND_HOST_NAME,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  : {
      origin: "https://websockets-front.onrender.com",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
