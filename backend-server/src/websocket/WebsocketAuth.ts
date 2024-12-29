import { COOKIE_SECRET, JWT_SECRET } from "../config";
import {
  extractJwtFromRequest,
  isValidToken,
} from "../middlewares/cookieService";
import jwt from "jsonwebtoken";
import { userWebSockets } from "./WebsocketServer";
import WebSocket from "ws";

export function authenticateToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authenticate(
  request: any,
  socket: any,
  callback: (error: boolean, user?: any) => void
) {
  const token = extractJwtFromRequest(request, COOKIE_SECRET);

  if (!token) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return callback(true);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return callback(true);
    }

    callback(false, decoded);
  });
}

export function saveUserInUserWebSockets(userId: number, ws: WebSocket) {
  userWebSockets.set(userId, ws);
}

export function removeUserWebSocket(ws: WebSocket): void {
  userWebSockets.forEach((value, key) => {
    if (value === ws) {
      userWebSockets.delete(key);
    }
  });
}

export function authenticateConnectionRequest(socket: any, req: any) {
  const authorizationToken = extractJwtFromRequest(req, COOKIE_SECRET);
  if (!isValidToken(authorizationToken)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
}
