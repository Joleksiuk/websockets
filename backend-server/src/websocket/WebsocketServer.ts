import WebSocket, { WebSocketServer } from "ws";
import {
  addMessageToQueue,
  handleMessage,
  handleUserLeftRoom,
  isClientAliveMessage,
} from "./WebsocketMessageService";
import { WebSocketExt, WSRoom } from "./WebsocketModels";
import {
  authenticateAndSecureConnection,
  secureMessageBeforeProcessing,
} from "./WebsocketConnectionSecurityService";
import {
  setupIsAliveInterval,
  setupRateLimitInterval,
} from "./WebsocketIntervals";
import { removeUserWebSocket, saveUserInUserWebSockets } from "./WebsocketAuth";
import Redis from "ioredis";
import { extractJwtFromRequest } from "../middlewares/cookieService";
import jwt from "jsonwebtoken";
import { COOKIE_SECRET, JWT_SECRET } from "../config";

function onSocketPreError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

function onSocketPostError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "",
});

export const rooms: Map<string, WSRoom> = new Map();
export const userWebSockets: Map<number, WebSocket> = new Map();

export default function initializeWebSocketServer(server: any) {
  const wss: WebSocketServer = new WebSocketServer({ noServer: true });

  redisSubscriber.subscribe("websocket:process");
  redisSubscriber.on("message", (channel, message) => {
    if (channel === "websocket:process") {
      const clientMessage = JSON.parse(message);
      console.log("Processing delegated message from worker:", clientMessage);
      handleMessage(clientMessage);
    }
  });

  server.on("upgrade", (request, socket, head) => {
    console.log("Upgrade request received");
    socket.on("error", onSocketPreError);

    //authenticateAndSecureConnection(socket, request);
    wss.handleUpgrade(request, socket, head, (ws) => {
      socket.removeListener("error", onSocketPreError);

      // const authorizationToken = extractJwtFromRequest(request, COOKIE_SECRET);
      // const decodedJwt = jwt.verify(authorizationToken, JWT_SECRET);
      const randomId = Math.floor(Math.random() * 1000000);
      saveUserInUserWebSockets(randomId, ws);

      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws: WebSocketExt, req) => {
    ws.isAlive = true;
    ws.connectionTime = new Date();

    ws.on("error", onSocketPostError);
    ws.on("message", (message) => {
      secureMessageBeforeProcessing(message, ws, req);

      if (isClientAliveMessage(message)) {
        ws.isAlive = true;
      } else {
        addMessageToQueue(message);
      }
    });

    ws.on("close", () => {
      handleUserLeftRoom(ws);
      removeUserWebSocket(ws);
    });
  });

  const isAliveInterval = setupIsAliveInterval(wss);
  const rateLimitInterval = setupRateLimitInterval(wss);

  wss.on("close", () => {
    clearInterval(isAliveInterval);
    clearInterval(rateLimitInterval);
  });
}
