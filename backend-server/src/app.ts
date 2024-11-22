import bodyParser from "body-parser";
import morgan from "morgan";
import express, { Application, Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
import { validationResult } from "express-validator";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET } from "./config";

function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  const errorStatus = err.status || 500;
  const errorMessage = { message: err.message || "Internal Server Error" };
  res.status(errorStatus).send(errorMessage);
}

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app: Application = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser(COOKIE_SECRET));

Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...(route.validation || []),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const result = await new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        if (!res.headersSent && result !== undefined) {
          res.json(result);
        }
      } catch (error) {
        next(error);
      }
    }
  );
});

app.use(handleError);

export default app;
