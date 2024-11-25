import { WebSocketServer, WebsocketServer, Websocket, RawData } from "ws";
import { handleMessage, handleUserLeftRoom } from "./WebsocketService";
import { COOKIE_AT_KEY, COOKIE_SECRET } from "../config";
import {
  extractJwtFromRequest,
  isValidToken,
} from "../middlewares/cookieService";

const HEARTBEAT_INTERVAL: number = 5000 * 1000; //(5000 seconds = 83 minutes );
const HEARTBEAT_VALUE: number = 1;

// Error handling pre connection errors
function onSocketPreError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

// Error handling any post connection errors
function onSocketPostError(error: Error) {
  console.error("Error occurred in websocket server: ", error);
}

function ping(ws: Websocket) {
  console.log("ping");
  ws.send(Buffer.from([HEARTBEAT_VALUE]), { binary: true });
}

export default function initializeWebSocketServer(server: any) {
  const wss: WebsocketServer = new WebSocketServer({ noServer: true }); // Pass the server option

  server.on("upgrade", (request, socket, head) => {
    socket.on("error", onSocketPreError);

    const authorizationToken = extractJwtFromRequest(
      request,
      COOKIE_SECRET,
      COOKIE_AT_KEY
    );

    console.log("Extracted JWT: ", authorizationToken);

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

  wss.on("connection", (ws, req) => {
    (ws as any).isAlive = true;

    ws.on("error", onSocketPostError);
    ws.on("message", (message: RawData, isBinary) => {
      if (isBinary && (message as any)[0] === HEARTBEAT_VALUE) {
        ws.isAlive = true;
        console.log("pong");
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
    wss.clients.forEach((client) => {
      if (!client.isAlive) return client.terminate();

      client.isAlive = false;
      ping(client);
    });
  }, HEARTBEAT_INTERVAL);

  wss.on("close", () => {
    clearInterval(interval);
  });
}
