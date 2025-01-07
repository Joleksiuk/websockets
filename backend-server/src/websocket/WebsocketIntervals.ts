import WebSocket from "ws";
import { WebSocketExt } from "./WebsocketModels";
import { rateLimitMap, sendHealthCheck } from "./WebsocketMessageService";

const HEARTBEAT_INTERVAL: number = 5000 * 6;
const MAX_CONNECTION_TIME: number = 5000 * 100;

function isClientAliveForTooLong(ws: WebSocketExt) {
  const now = new Date();
  const diff = now.getTime() - ws.connectionTime.getTime();

  if (diff > MAX_CONNECTION_TIME) {
    console.log(
      getCurrentTime(),
      " Client is alive for too long. Closing connection."
    );
    return true;
  }

  return false;
}

export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function setupIsAliveInterval(wss: WebSocket.Server) {
  const isAliveInterval = setInterval(() => {
    console.log(getCurrentTime(), "Serwer: PING");
    wss.clients.forEach((client: WebSocketExt) => {
      if (!client.isAlive || isClientAliveForTooLong(client))
        return client.terminate();

      client.isAlive = false;
      sendHealthCheck(client);
    });
  }, HEARTBEAT_INTERVAL);
  return isAliveInterval;
}

export function setupRateLimitInterval(wss: WebSocket.Server) {
  const rateLimitInterval = setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (now - value.lastAttempt > 10000) {
        rateLimitMap.delete(key);
      }
    });
  }, 10000);
  return rateLimitInterval;
}
