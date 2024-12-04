import WebSocket, { Server, WebSocket as WS } from "ws";

export type WSUser = {
  ws: WS;
  id: number;
  username: string;
};

export type WSRoom = {
  users: Array<WSUser>;
  name: string;
};

export type ClientEvent = "JOIN ROOM" | "LEAVE ROOM" | "SEND CHAT MESSAGE";
export type ServerEvent =
  | "USER JOINED ROOM"
  | "USER LEFT ROOM"
  | "USER SENT CHAT MESSAGE"
  | "SERVER CLOSED";

export type ServerMessage<
  TPayload =
    | UserJoinedServerMessagePayload
    | UserLeftServerMessagePayload
    | UserChatMessageServerMessagePayload
> = {
  eventName: ServerEvent;
  payload: TPayload;
};

export type ClientMessage<
  TPayload =
    | UserChatMessageClientMessagePayload
    | UserJoinedClientMessagePayload
    | UseLeftClientMessagePayload
> = {
  eventName: ClientEvent;
  payload: TPayload;
};

export type UserJoinedClientMessagePayload = {
  roomId: number;
  userId: number;
};

export type UserJoinedServerMessagePayload = {
  roomId: number;
  userId: number;
  activeUsers: Array<{ userId: number; username: string }>;
};

export type UseLeftClientMessagePayload = {
  roomId: number;
  userId: number;
};

export type UserLeftServerMessagePayload = {
  roomId: number;
  userId: number;
};

export type UserChatMessageClientMessagePayload = {
  roomId: number;
  userId: number;
  message: string;
};

export type UserChatMessageServerMessagePayload = {
  roomId: number;
  userId: number;
  message: string;
  username: string;
};

export type UserJoinedClientMessage =
  ClientMessage<UserJoinedClientMessagePayload>;
export type UserLeftClientMessage = ClientMessage<UseLeftClientMessagePayload>;
export type UserSentChatMessageClientMessage =
  ClientMessage<UserChatMessageClientMessagePayload>;

export type UserJoinedServerMessage =
  ServerMessage<UserJoinedServerMessagePayload>;
export type UserLeftServerMessage = ServerMessage<UserLeftServerMessagePayload>;
export type UserSentChatMessageServerMessage =
  ServerMessage<UserChatMessageServerMessagePayload>;
