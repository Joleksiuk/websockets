import { CorsOptions } from "cors";
import { HOST_NAME, LOCAL_SERVER } from "../config";

export const corsOptions: CorsOptions = LOCAL_SERVER
  ? {
      origin: HOST_NAME,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  : {
      origin: (origin, callback) => {
        if (!origin || origin.endsWith(".onrender.com")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
