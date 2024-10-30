import { AppDataSource } from "./data-source";
import app from "./app";
import { port, CORS_ORIGIN } from "./config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimiter from "./utils/rateLimiter";

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(
        `Express server has started. Open http://localhost:${port}/users to see results`
      );
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
    app.use(helmet());
    app.use(rateLimiter);
  })
  .catch((error) => console.log(error));
