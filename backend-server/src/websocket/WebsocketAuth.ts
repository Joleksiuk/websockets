import { COOKIE_SECRET, JWT_SECRET } from "../config";
import {
  extractJwtFromRequest,
  isValidToken,
} from "../middlewares/cookieService";
import jwt from "jsonwebtoken";
import { userWebSockets } from "./WebsocketServer";

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

export function authenticateConnectionRequest(socket: any, req: any) {
  const authorizationToken = extractJwtFromRequest(req, COOKIE_SECRET);
  const decodedJwt = jwt.verify(authorizationToken, JWT_SECRET);
  const user = decodedJwt.user;
  userWebSockets[user.userId] = socket;

  if (!isValidToken(authorizationToken)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
}
