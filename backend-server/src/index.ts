import { AppDataSource } from "./data-source";
import app from "./app";
import { HOST_NAME, PORT, USE_SSL, LOCAL_SERVER } from "./config";
import express from "express";
import rateLimiter from "./utils/rateLimiter";
import initializeWebSocketServer from "./websocket/WebsocketServer";
import * as https from "https";
import { loadSSLCertificates } from "./utils/LoadSSL";
import http from "http";

const sslOptions = loadSSLCertificates();

AppDataSource.initialize()
  .then(async () => {
    if (USE_SSL) {
      const httpsServer = https.createServer(sslOptions, app);

      httpsServer.listen(PORT, () => {
        console.log(
          `Secure Express server has started. Open https://${HOST_NAME} to see results`
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
          `Express server has started. Open http://${HOST_NAME} to see results`
        );
      });

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(rateLimiter);
      initializeWebSocketServer(httpServer);
    }
  })
  .catch((error) => console.error("Error initializing data source:", error));
