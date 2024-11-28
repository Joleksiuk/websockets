import { AppDataSource } from "./data-source";
import app from "./app";
import { port, USE_SSL } from "./config";
import express from "express";
import helmet from "helmet";
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

      httpsServer.listen(port, () => {
        console.log(
          `Secure Express server has started. Open https://localhost:${port}/users to see results`
        );
      });

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(helmet());
      app.use(rateLimiter);

      initializeWebSocketServer(httpsServer);
    } else {
      const httpServer = http.createServer(app); // Correctly use http here

      httpServer.listen(port, () => {
        console.log(
          `Express server has started. Open http://localhost:${port}/users to see results`
        );
      });

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(helmet());
      app.use(rateLimiter);

      // Initialize WebSocket server
      initializeWebSocketServer(httpServer);
    }
  })
  .catch((error) => console.log("Error initializing data source:", error));
