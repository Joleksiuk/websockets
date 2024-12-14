import { AppDataSource } from "./data-source";
import app from "./app";
import { HOST_NAME, port, USE_SSL } from "./config";
import express from "express";
import helmet from "helmet";
import rateLimiter from "./utils/rateLimiter";
import initializeWebSocketServer from "./websocket/WebsocketServer";
import * as https from "https";
import { loadSSLCertificates } from "./utils/LoadSSL";
import http from "http";
import { helmetWithCSP } from "./middlewares/helmetWithCSP";

const sslOptions = loadSSLCertificates();

AppDataSource.initialize()
  .then(async () => {
    if (USE_SSL) {
      const httpsServer = https.createServer(sslOptions, app);

      httpsServer.listen(port, () => {
        console.log(
          `Secure Express server has started. Open https://${HOST_NAME}:${port}/users to see results`
        );
      });
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(rateLimiter);
      initializeWebSocketServer(httpsServer);
    } else {
      const httpServer = http.createServer(app);

      httpServer.listen(port, () => {
        console.log(
          `Express server has started. Open http://${HOST_NAME}:${port}/users to see results`
        );
      });

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(rateLimiter);
      initializeWebSocketServer(httpServer);
    }
  })
  .catch((error) => console.error("Error initializing data source:", error));
