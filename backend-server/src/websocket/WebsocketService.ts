import { ChatMessage, Room } from "./WebsocketModels";
import WebSocket from "ws";
import jwt from "jsonwebtoken";
import { COOKIE_SECRET, JWT_SECRET } from "../config";
import { extractJwtFromRequest } from "../middlewares/cookieService";
import { findRoomById } from "./WebsocketRepository";

const rooms: Map<string, Room> = new Map();

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
  const { roomId, username } = message;
  const roomKey = String(roomId); // Normalize roomId to string

  const roomFromDb = await findRoomById(roomKey);
  const wsUser = { ws, id: 1, username };

  if (roomFromDb) {
    if (!rooms.has(roomKey)) {
      rooms.set(roomKey, { users: [] });
    }

    const room = rooms.get(roomKey)!;

    if (!room.users.find((user) => user.username === username)) {
      room.users.push(wsUser);
    }

    console.log("Updated room:", room);

    const joinNotification = {
      activity: "USER JOINED ROOM",
      roomId: roomKey,
      username,
      timestamp: Date.now(),
      message: `${username} has joined the room.`,
    };

    broadcastToRoom(roomKey, joinNotification);
  } else {
    console.warn(
      `${username} is unable to join room with id: ${roomKey} - Room does not exist`
    );
  }
}

export function handleUserLeftRoom(ws: WebSocket): void {
  // rooms.forEach((room, roomId) => {
  //   if (room.users.has(ws)) {
  //     room.users.delete(ws);
  //     const disconnectNotification = {
  //       activity: "USER LEFT ROOM",
  //       roomId,
  //       username: "Unknown",
  //       timestamp: Date.now(),
  //       message: "A user has left the room.",
  //     };
  //     broadcastToRoom(roomId, disconnectNotification);
  //   }
  // });
}

export function handleUserSendChatMessage(message: ChatMessage): void {
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

export function broadcastToRoom(roomId: string | number, message: any): void {
  console.log("broadcastToRoom ", rooms);

  const roomKey = String(roomId); // Normalize roomId to string
  if (rooms.has(roomKey)) {
    const room = rooms.get(roomKey)!;
    room.users.forEach((client) => {
      console.log(
        `WebSocket state for ${client.username}:`,
        client.ws.readyState
      );
      if (client.ws.readyState === WebSocket.OPEN) {
        console.log(`Sending message to ${client.username}:`, message);
        client.ws.send(JSON.stringify(message), (err) => {
          if (err) {
            console.error("Error sending message to client:", err);
          }
        });
      } else {
        console.warn(
          `WebSocket for ${client.username} is not open. ReadyState: ${client.ws.readyState}`
        );
      }
    });
  } else {
    console.warn(`Room with ID ${roomId} not found in rooms map.`);
  }
}
