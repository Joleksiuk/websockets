import {
  ClientMessage,
  ServerMessage,
  UserJoinedClientMessage,
  UserJoinedServerMessage,
  UserLeftServerMessage,
  UserSentChatMessageClientMessage,
  UserSentChatMessageServerMessage,
  WebSocketExt,
} from "./WebsocketModels";
import WebSocket from "ws";

import { findRoomById, findUserById } from "./WebsocketRepository";
import { rooms } from "./WebsocketServer";
import { getCurrentTime } from "./WebsocketIntervals";

export const rateLimitMap = new Map<
  string,
  { count: number; lastAttempt: number }
>();

export function limitRate(
  ip: string,
  limit: number = 5,
  timeWindow: number = 1000
): boolean {
  const currentTime = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, lastAttempt: currentTime });
    return false;
  }

  const rateData = rateLimitMap.get(ip)!;

  if (currentTime - rateData.lastAttempt < timeWindow) {
    rateData.count += 1;
  } else {
    rateData.count = 1;
  }

  rateData.lastAttempt = currentTime;

  if (rateData.count > limit) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    return true;
  }

  return false;
}

export const sendHealthCheck = (ws: WebSocketExt) => {
  const pingMessage: ServerMessage = {
    eventName: "PING",
    payload: null,
  };
  ws.send(JSON.stringify(pingMessage));
};

export function handleMessage(message: any, ws: WebSocket): void {
  try {
    const clientMessage: ClientMessage = JSON.parse(message);
    console.log("Received message from client: ", clientMessage);
    const { eventName } = clientMessage;

    switch (eventName) {
      case "JOIN ROOM":
        handleUserJoinedRoom(clientMessage, ws);
        break;
      case "LEAVE ROOM":
        handleUserLeftRoom(ws);
        break;
      case "SEND CHAT MESSAGE":
        handleUserSendChatMessage(
          clientMessage as UserSentChatMessageClientMessage
        );
        break;
      default:
        console.warn("Unknown eventName: ", eventName);
        break;
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

    const serverMessage: UserJoinedServerMessage = {
      eventName: "USER JOINED ROOM",
      payload: {
        roomId: Number(roomId),
        userId: user.id,
        activeUsers: room.users.map((wsUser) => {
          return {
            userId: wsUser.id,
            username: wsUser.username,
          };
        }),
      },
    };

    broadcastToRoom(roomId, serverMessage);
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

      const serverMessage: UserLeftServerMessage = {
        eventName: "USER LEFT ROOM",
        payload: {
          roomId: Number(roomId),
          userId: user.id,
        },
      };
      broadcastToRoom(Number(roomId), serverMessage);
    }
  });
}

export async function handleUserSendChatMessage(
  clientMessage: UserSentChatMessageClientMessage
): Promise<void> {
  const { roomId, message, userId } = clientMessage.payload;

  const user = await findUserById(userId);
  const serverChatMessage: UserSentChatMessageServerMessage = {
    eventName: "USER SENT CHAT MESSAGE",
    payload: {
      roomId: Number(roomId),
      userId: Number(userId),
      username: user.username,
      message: message,
    },
  };
  broadcastToRoom(roomId, serverChatMessage);
}

export function broadcastToRoom(roomId: number, message: ServerMessage): void {
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

export function isClientAliveMessage(message: any) {
  const msg: ClientMessage = JSON.parse(message);
  if (msg?.eventName === "PONG") {
    console.log(getCurrentTime(), " Client: PONG");
    return true;
  }
  return false;
}
