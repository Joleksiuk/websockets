import bodyParser from "body-parser";
import morgan from "morgan";
import express, { Application, Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
import { validationResult } from "express-validator";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET, HOST_NAME } from "./config";
import { authenticateRequest } from "./middlewares/authentication";
import { setupFrontend } from "./middlewares/setupFrontend";
import { helmetWithCSP } from "./middlewares/helmetWithCSP";

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
  origin: HOST_NAME,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app: Application = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser(COOKIE_SECRET));
app.use(helmetWithCSP);
app.use("/secure", authenticateRequest);

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

setupFrontend(app);
app.use(handleError);

export default app;
