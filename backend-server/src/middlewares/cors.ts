import { CorsOptions } from "cors";
import { LOCAL_SERVER } from "../config";

export const corsOptions: CorsOptions = LOCAL_SERVER
  ? {
      origin: "https://localhost:3000",
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
