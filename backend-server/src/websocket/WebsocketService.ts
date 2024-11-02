import { ChatMessage, Room } from "./WebsocketModels";
import WebSocket from "ws";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

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
 * Helper function to authenticate a websocket connection
 * @param ws - The websocket connection.
 * @param request - The request object.
 */
export function authenticate(ws: WebSocket, request): any {
  const token = request.url?.split("token=")[1];
  if (!token) {
    ws.close(1008, "Token not provided");
    return;
  }

  const user = authenticateToken(token);
  if (!user) {
    ws.close(1008, "Invalid token");
    return;
  }
}

/**
 * Helper function to handle websocket messages from client
 * @param message - messageSent from the client.
 * @param ws - The websocket connection.
 */
export function handleMessage(message: string, ws: WebSocket): void {
  try {
    const chatMessage: ChatMessage = JSON.parse(message);
    const { activity } = chatMessage;

    switch (activity) {
      case "JOIN ROOM":
        handleUserJoinedRoom(chatMessage, ws);
        break;
      case "LEAVE ROOM":
        handleUserLeftRoom(ws);
        break;
      case "CREATE ROOM":
        handleCreateRoom(chatMessage, ws);
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
 * Helper function to create a new chatroom with auto-generated roomId and password
 * @param message - messageSent from the client.
 * @param ws - The websocket connection which created the room.
 */
export function handleCreateRoom(message: ChatMessage, ws: WebSocket): void {
  const roomId = generateId(4);
  const password = generateId(4);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Set([ws]),
      chatroomName: message.chatroomName || "Untitled Room",
      isOpen: message.isOpen ?? true,
      password,
    });

    console.log(
      `Creating room with id: ${roomId}, name: ${message.chatroomName}, password: ${password}`
    );

    ws.send(
      JSON.stringify({
        activity: "ROOM CREATED",
        roomId,
        password,
      })
    );
  } else {
    console.log(
      `Unable to create room with id: ${roomId} - Room already exists`
    );
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
  };
  broadcastToRoom(roomId, chatMessage);
}

/**
 * Helper function to broadcast a message to all clients in a room.
 * @param roomId - The ID of the room to send the message to.
 * @param message - The message to broadcast.
 */
export function broadcastToRoom(roomId: string, message: ChatMessage): void {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId)!;
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
