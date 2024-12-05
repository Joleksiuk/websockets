import { WebSocketServer, WebSocket } from "ws";
import { handleMessage, handleUserLeftRoom } from "./WebsocketService";
import { COOKIE_SECRET } from "../config";
import {
  extractJwtFromRequest,
  isValidToken,
} from "../middlewares/cookieService";
import {
  ClientMessage,
  ServerMessage,
  WebSocketExt,
  WSRoom,
} from "./WebsocketModels";

const HEARTBEAT_INTERVAL: number = 5000 * 2; //(5000 seconds = 83 minutes );
const HEARTBEAT_VALUE: number = 1;

export const rooms: Map<string, WSRoom> = new Map();

function onSocketPreError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

function onSocketPostError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

function isClientAliveMessage(message: any) {
  const msg: ClientMessage = JSON.parse(message);
  if (msg?.eventName === "PONG") {
    console.log("PONG");
    return true;
  }
  console.log(" NO PONG");
  return false;
}

function ping(ws: WebSocketExt) {
  console.log("ping");
  const pingMessage: ServerMessage = {
    eventName: "PING",
    payload: null,
  };
  ws.send(JSON.stringify(pingMessage));
}

export default function initializeWebSocketServer(server: any) {
  const wss: WebSocketServer = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    socket.on("error", onSocketPreError);

    console.log("Upgrading connection...");
    const authorizationToken = extractJwtFromRequest(request, COOKIE_SECRET);

    if (!isValidToken(authorizationToken)) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      socket.removeListener("error", onSocketPreError);
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws: WebSocketExt, req) => {
    ws.isAlive = true;

    ws.on("error", onSocketPostError);
    ws.on("message", (message) => {
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

  const interval = setInterval(() => {
    console.log("firing interval");
    wss.clients.forEach((client: WebSocketExt) => {
      console.log("checking client");
      if (!client.isAlive) return client.terminate();

      client.isAlive = false;
      ping(client);
    });
  }, HEARTBEAT_INTERVAL);

  wss.on("close", () => {
    clearInterval(interval);
  });
}
