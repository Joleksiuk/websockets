import {
  ChatMessage,
  ClientMessage,
  UserJoinedClientMessage,
  WSRoom,
  WSUser,
} from "./WebsocketModels";
import WebSocket from "ws";

import { findRoomById, findUserById } from "./WebsocketRepository";
import { rooms } from "./WebsocketServer";

export function handleMessage(message: string, ws: WebSocket): void {
  try {
    const clientMessage: ClientMessage = JSON.parse(message);

    // if (!isAuthenticated(chatMessage)) {
    //   ws.send(JSON.stringify({ activity: "INVALID AUTHENTICATION" }));
    //   return;
    // }

    console.log("Received message from client: ", clientMessage);
    const { eventName } = clientMessage;

    switch (eventName) {
      case "USER JOINED ROOM":
        handleUserJoinedRoom(clientMessage, ws);
        break;
      // case "LEAVE ROOM":
      //   handleUserLeftRoom(ws);
      //   break;
      // case "MESSAGE":
      //   handleUserSendChatMessage(chatMessage);
      //   break;
      // default:
      //   console.warn("Unknown activity: ", activity);
      //   break;
    }
  } catch (error) {
    console.error("Error parsing message: ", error);
  }
}

export async function handleUserJoinedRoom(
  message: UserJoinedClientMessage,
  ws: WebSocket
): Promise<void> {
  const { roomId, userId } = message.payload;

  const roomKey = String(roomId);

  const user = await findUserById(Number(userId));
  const roomFromDb = await findRoomById(roomKey);

  if (roomFromDb) {
    if (!rooms.has(roomKey)) {
      rooms.set(roomKey, { users: [], name: roomFromDb.name });
    }

    const room = rooms.get(roomKey)!;

    const wsUser = { ws, id: userId, username: user.username };
    if (!room.users.find((user) => user.username === wsUser.username)) {
      room.users.push(wsUser);
    }

    console.log("Updated room:", room);

    const joinNotification = {
      activity: "USER JOINED ROOM",
      roomId: roomKey,
      username: wsUser.username,
      timestamp: Date.now(),
      message: `${wsUser.username} has joined the room.`,
    };

    broadcastToRoom(roomKey, joinNotification);
  } else {
    console.warn(
      `${user.username} is unable to join room with id: ${roomKey} - Room does not exist`
    );
  }
}

export function handleUserLeftRoom(ws: WebSocket): void {
  rooms.forEach((room, roomId) => {
    const userIndex = room.users.findIndex((user) => user.ws === ws);
    if (userIndex !== -1) {
      const user = room.users[userIndex];
      room.users.splice(userIndex, 1);

      const leaveNotification = {
        activity: "USER LEFT ROOM",
        roomId,
        username: user.username,
        timestamp: Date.now(),
        message: `${user.username} has left the room.`,
      };

      broadcastToRoom(roomId, leaveNotification);
    }
  });
}

export function handleUserSendChatMessage(message: ChatMessage): void {
  const { roomId, token } = message;
  console.log("handleUserSendChatMessage ", message.token);
  const chatMessage = {
    activity: "USER SENT MESSAGE",
    roomId,
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
