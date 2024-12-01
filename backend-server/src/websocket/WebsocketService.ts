import { ChatMessage, Room } from "./WebsocketModels";
import WebSocket from "ws";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import * as url from "url";

const rooms: Map<string, Room> = new Map();
const users: Map<WebSocket, string> = new Map();

/**
 * Helper function to create a random ID
 * @param length - The length of the generated ID.
 * @returns The generated ID.
 */
function generateId(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Helper function to authenticate a token
 * @param token - The token to authenticate.
 * @returns The authenticated user.
 */
function authenticateToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Helper function to authenticate a WebSocket connection
 * @param request - The HTTP request object.
 * @param socket - The raw socket.
 * @param callback - The callback function.
 */
export function authenticate(
  request: any,
  socket: any,
  callback: (error: boolean, user?: any) => void
) {
  const parsedUrl = url.parse(request.url, true);
  const token = parsedUrl.query.token as string;

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

/**
 * Helper function to authenticate a WebSocket connection
 * @param request - The HTTP request object.
 * @param socket - The raw socket.
 * @param callback - The callback function.
 */
export function isAuthenticated(chatMessage: ChatMessage) {
  const { token } = chatMessage;

  if (!token) {
    return false;
  }

  return authenticateToken(token);
}

/**
 * Helper function to handle websocket messages from client
 * @param message - messageSent from the client.
 * @param ws - The websocket connection.
 */
export function handleMessage(message: string, ws: WebSocket): void {
  try {
    const chatMessage: ChatMessage = JSON.parse(message);

    if (!isAuthenticated(chatMessage)) {
      ws.send(JSON.stringify({ activity: "INVALID AUTHENTICATION" }));
      return;
    }

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

/**
 * Helper function to handle user joining a room
 * @param message - messageSent from the client.
 * @param ws - The websocket connection trying to join.
 */
export function handleUserJoinedRoom(
  message: ChatMessage,
  ws: WebSocket
): void {
  const { roomId, username, password } = message;

  if (rooms.has(roomId)) {
    const room = rooms.get(roomId)!;

    if (room.password && room.password !== password) {
      ws.send(JSON.stringify({ activity: "INVALID AUTHENTICATION" }));
      return;
    }

    const joinNotification = {
      activity: "USER JOINED ROOM",
      roomId,
      username,
      timestamp: Date.now(),
      message: `${username} has joined the room.`,
    };

    room.users.add(ws);
    broadcastToRoom(roomId, joinNotification);
  } else {
    console.log(
      `${username} is unable to join room with id: ${roomId} - Room does not exist`
    );
  }
}

/**
 * Helper function to handle user leaving a room
 * @param ws - The websocket connection leaving the room.
 */
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

/**
 * Helper function to handle user sending a chat message
 * @param message - messageSent from the client.
 */
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

/**
 * Helper function to broadcast a message to all clients in a room.
 * @param roomId - The ID of the room to send the message to.
 * @param message - The message to broadcast.
 */
export function broadcastToRoom(roomId: string, message: any): void {
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
