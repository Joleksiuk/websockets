import { z } from "zod";

// Define basic schemas for payloads
const UserJoinedClientMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
});

const UseLeftClientMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
});

const UserChatMessageClientMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
  message: z.string(),
});

const UserJoinedServerMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
  activeUsers: z.array(
    z.object({
      userId: z.number(),
      username: z.string(),
    })
  ),
});

const UserLeftServerMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
});

const UserChatMessageServerMessagePayloadSchema = z.object({
  roomId: z.number(),
  userId: z.number(),
  message: z.string(),
  username: z.string(),
});

export const ClientMessageSchema = z.object({
  eventName: z.enum(["JOIN ROOM", "LEAVE ROOM", "SEND CHAT MESSAGE", "PONG"]),
  payload: z.union([
    UserJoinedClientMessagePayloadSchema,
    UseLeftClientMessagePayloadSchema,
    UserChatMessageClientMessagePayloadSchema,
    z.null(),
  ]),
});

export const ServerMessageSchema = z.object({
  eventName: z.enum([
    "USER JOINED ROOM",
    "USER LEFT ROOM",
    "USER SENT CHAT MESSAGE",
    "SERVER CLOSED",
    "PING",
  ]),
  payload: z.union([
    UserJoinedServerMessagePayloadSchema,
    UserLeftServerMessagePayloadSchema,
    UserChatMessageServerMessagePayloadSchema,
  ]),
});
