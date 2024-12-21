import { limitRate } from "./WebsocketMessageService";
import { authenticateConnectionRequest } from "./WebsocketAuth";
import WebSocket from "ws";
import { ClientMessageSchema, ServerMessageSchema } from "./ZodWebsocketModels";
const MAX_MESSAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_REQUEST_PER_SECOND = 10;
const SECOND_IN_MS = 1000;

const allowedOrigins = [
  "https://websockets-front.onrender.com",
  "https://localhost:3000",
];

export function verifyOrigin(socket: any, request: any) {
  const origin = request.headers.origin;
  console.log("Verifying origin: ", origin);
  if (!origin || !allowedOrigins.includes(origin)) {
    console.log(`Rejected connection from origin: ${origin}`);
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }
}

export function verifyConnectionRateLimit(socket: any, req: any) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (limitRate(ip, MAX_REQUEST_PER_SECOND, SECOND_IN_MS)) {
    socket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n");
    socket.destroy();
    return;
  }
}

export function authenticateAndSecureConnection(socket: any, req: any) {
  verifyOrigin(socket, req);
  verifyConnectionRateLimit(socket, req);
  authenticateConnectionRequest(socket, req);
}

export const secureMessageBeforeProcessing = (
  message: any,
  ws: WebSocket,
  req: any
) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (limitRate(ip.toString(), MAX_REQUEST_PER_SECOND, SECOND_IN_MS)) {
    console.log(`Message rate limit exceeded for IP: ${ip}`);
    ws.terminate();
    return;
  }

  if (Buffer.byteLength(message) > MAX_MESSAGE_SIZE) {
    console.warn("Message too large, closing connection");
    ws.close(1009, "Message too large");
    return;
  }

  if (validateIncomingMessage(message)) {
    ws.close(1009, "Invalid message type");
    return;
  }
};

export function validateIncomingMessage(message: string): boolean {
  try {
    const parsedMessage = JSON.parse(message);

    const isClientMessage = [
      "JOIN ROOM",
      "LEAVE ROOM",
      "SEND CHAT MESSAGE",
      "PONG",
    ].includes(parsedMessage.eventName);

    if (isClientMessage) {
      const result = ClientMessageSchema.safeParse(parsedMessage);
      if (result.success) {
        return false;
      } else {
        return true;
      }
    } else {
      const result = ServerMessageSchema.safeParse(parsedMessage);
      if (result.success) {
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    return true;
  }
}
