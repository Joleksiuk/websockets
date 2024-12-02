import { ChatMessage, Room } from "./WebsocketModels";
import WebSocket from "ws";
import jwt from "jsonwebtoken";
import { COOKIE_SECRET, JWT_SECRET } from "../config";
import { extractJwtFromRequest } from "../middlewares/cookieService";
import { findRoomById } from "./WebsocketRepository";

const rooms: Map<string, Room> = new Map();
const users: Map<WebSocket, string> = new Map();

function authenticateToken(token: string): any {
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

export function isAuthenticated(chatMessage: ChatMessage) {
  const { token } = chatMessage;

  if (!token) {
    return false;
  }

  return authenticateToken(token);
}

export function handleMessage(message: string, ws: WebSocket): void {
  try {
    const chatMessage: ChatMessage = JSON.parse(message);

    // if (!isAuthenticated(chatMessage)) {
    //   ws.send(JSON.stringify({ activity: "INVALID AUTHENTICATION" }));
    //   return;
    // }

    console.log("Received message: ", chatMessage);
    const { activity } = chatMessage;

    switch (activity) {
      case "JOIN ROOM":
        handleUserJoinedRoom(chatMessage, ws);
        break;
      case "LEAVE ROOM":
        handleUserLeftRoom(ws);
        break;
      case "MESSAGE":
        handleUserSendChatMessage(chatMessage);
        break;
      default:
        console.warn("Unknown activity: ", activity);
        break;
    }
  } catch (error) {
    console.error("Error parsing message: ", error);
  }
}

export async function handleUserJoinedRoom(
  message: ChatMessage,
  ws: WebSocket
): Promise<void> {
  const { roomId, username, password } = message;

  const roomFromDb = await findRoomById(roomId);

  if (roomFromDb) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set() });
    }
    const room = rooms.get(roomId)!;

    const joinNotification = {
      activity: "USER JOINED ROOM",
      roomId,
      username,
      timestamp: Date.now(),
      message: `${username} has joined the room.`,
    };

    room.users.add(ws);
    console.log(room);
    broadcastToRoom(roomId, joinNotification);
  } else {
    console.log(
      `${username} is unable to join room with id: ${roomId} - Room does not exist`
    );
  }
}

export function handleUserLeftRoom(ws: WebSocket): void {
  rooms.forEach((room, roomId) => {
    if (room.users.has(ws)) {
      room.users.delete(ws);

      const disconnectNotification = {
        activity: "USER LEFT ROOM",
        roomId,
        username: users.get(ws),
        timestamp: Date.now(),
        message: "A user has left the room.",
      };

      broadcastToRoom(roomId, disconnectNotification);
    }
  });
}

export function handleUserSendChatMessage(message: ChatMessage): void {
  console.log("Handling chat message: ", message);
  const { roomId, username } = message;
  const chatMessage = {
    activity: "USER SENT MESSAGE",
    roomId,
    username,
    timestamp: Date.now(),
    message: message.message,
    token: message.token,
  };
  broadcastToRoom(roomId, chatMessage);
}

export function broadcastToRoom(roomId: string, message: any): void {
  console.log("broadcastToRoom ", roomId);
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId)!;
    console.log("Broadcasting message to room: ", room);
    room.users.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message), (err) => {
          if (err) {
            console.error("Error sending message: ", err);
          }
        });
      }
    });
  }
}
