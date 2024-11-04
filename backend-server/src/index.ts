import { AppDataSource } from "./data-source";
import app from "./app";
import { port } from "./config";
import express from "express";
import helmet from "helmet";
import rateLimiter from "./utils/rateLimiter";
import initializeWebSocketServer from "./websocket/WebsocketServer";
import fs from "fs";
import * as https from "https";
import { loadSSLCertificates } from "./utils/LoadSSL";

const sslOptions = loadSSLCertificates();

AppDataSource.initialize()
  .then(async () => {
    const httpsServer = https.createServer(sslOptions, app);

    httpsServer.listen(port, () => {
      console.log(
        `Secure Express server has started. Open https://localhost:${port}/users to see results`
      );
    });

    // Additional middlewares for security and data handling
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(rateLimiter);

    // Initialize WebSocket server using the HTTPS server
    initializeWebSocketServer(httpsServer);
  })
  .catch((error) => console.log("Error initializing data source:", error));
