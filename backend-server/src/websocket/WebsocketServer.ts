import { WebSocketServer, WebsocketServer, Websocket, RawData } from "ws";
import {
  authenticate,
  handleMessage,
  handleUserLeftRoom,
} from "./WebsocketService";

const HEARTBEAT_INTERVAL: number = 5000;
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
  ws.send(HEARTBEAT_VALUE), { binary: true };
}

export default function initializeWebSocketServer(server: any) {
  const wss: WebsocketServer = new WebSocketServer({ server }); // Pass the server option

  // server.on("upgrade", (request, socket, head) => {
  //   socket.on("error", onSocketPreError);

  //   // authenticate(request, socket);

  //   wss.handleUpgrade(request, socket, head, (ws) => {
  //     socket.removeListener("error", onSocketPreError);
  //     wss.emit("connection", ws, request);
  //   });
  // });

  wss.on("connection", (ws, req) => {
    ws.isAlive = true;

    ws.on("error", onSocketPostError);
    ws.on("message", (message: RawData, isBinary) => {
      // if (isBinary && (message as any)[0] === HEARTBEAT_VALUE) {
      //   ws.isAlive = true;
      //   return;
      // } else {
      handleMessage(message, ws);
      // }
    });

    ws.on("close", () => {
      handleUserLeftRoom(ws);
    });
  });

  // const interval = setInterval(() => {
  //   console.log("firing interval");
  //   wss.clients.forEach((client) => {
  //     if (!client.isAlive) return client.terminate();

  //     client.isAlive = false;
  //     ping(client);
  //   });
  // }, HEARTBEAT_INTERVAL);

  // wss.on("close", () => {
  //   clearInterval(interval);
  // });
}
