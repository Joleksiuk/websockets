import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { validationResult } from "express-validator";

function handleError(err, req, res, next) {
  console.error(err.stack);
  const errorStatus = err.status || 500;
  const errorMessage = { message: err.message || "Internal Server Error" };
  res.status(errorStatus).send(errorMessage);
}

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...(route.validation || []),
    async (req: Request, res: Response, next: Function) => {
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
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
});

app.use(handleError);

export default app;
