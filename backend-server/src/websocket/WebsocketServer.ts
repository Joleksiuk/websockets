import { WebSocketServer } from "ws";
import {
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

export const rooms: Map<string, WSRoom> = new Map();

function onSocketPreError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

function onSocketPostError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

export default function initializeWebSocketServer(server: any) {
  const wss: WebSocketServer = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    console.log("Upgrade request received");
    socket.on("error", onSocketPreError);

    authenticateAndSecureConnection(socket, request);
    wss.handleUpgrade(request, socket, head, (ws) => {
      socket.removeListener("error", onSocketPreError);
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
        handleMessage(message, ws);
      }
    });

    ws.on("close", () => {
      handleUserLeftRoom(ws);
    });
  });

  const isAliveInterval = setupIsAliveInterval(wss);
  const rateLimitInterval = setupRateLimitInterval(wss);

  wss.on("close", () => {
    clearInterval(isAliveInterval);
    clearInterval(rateLimitInterval);
  });
}
