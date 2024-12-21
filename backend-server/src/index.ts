import { AppDataSource } from "./data-source";
import app from "./app";
import {
  FRONTEND_HOST_NAME,
  PORT,
  LOCAL_SERVER,
  USE_SSL,
  PROTOCOLE,
  BACKEND_HOST_NAME,
} from "./config";
import express from "express";
import rateLimiter from "./utils/rateLimiter";
import initializeWebSocketServer from "./websocket/WebsocketServer";
import * as https from "https";
import { loadSSLCertificates } from "./utils/LoadSSL";
import http from "http";

const sslOptions = loadSSLCertificates();

AppDataSource.initialize()
  .then(async () => {
    if (LOCAL_SERVER && USE_SSL) {
      const httpsServer = https.createServer(sslOptions, app);

      httpsServer.listen(PORT, () => {
        console.log(
          `Secure Express server has started on adress ${PROTOCOLE}://${BACKEND_HOST_NAME}. Open ${PROTOCOLE}://${FRONTEND_HOST_NAME} to see frontend`
        );
      });
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(rateLimiter);
      initializeWebSocketServer(httpsServer);
    } else {
      const httpServer = http.createServer(app);

      httpServer.listen(PORT, () => {
        console.log(
          `Express server has started on adress ${PROTOCOLE}://${BACKEND_HOST_NAME}. Open ${PROTOCOLE}://${FRONTEND_HOST_NAME} to see frontend`
        );
      });

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(rateLimiter);
      initializeWebSocketServer(httpServer);
    }
  })
  .catch((error) => console.error("Error initializing data source:", error));
