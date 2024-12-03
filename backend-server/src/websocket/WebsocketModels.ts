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

export interface ChatMessage {
  roomId: string;
  username: string;
  activity: string;
  message?: string;
  chatroomName?: string;
  isOpen?: boolean;
  password?: string;
  token: {
    userId: number;
    username: string;
    iat: number;
    exp: number;
  };
}

export type ServerMessage = {
  eventName: string;
  payload: any;
};

export type ClientMessage<TPayload = any> = {
  eventName: string;
  payload: TPayload;
};

export type UserJoinedClientMessage = ClientMessage<{
  roomId: number;
  userId: number;
}>;

export type UserJoinedServerMessage = {
  eventName: "USER JOINED ROOM";
  payload: {
    roomId: string;
    username: string;
    activeUsers: Array<{ userId: string; username: string }>;
  };
};

export type UserLeftServerMessage = {
  eventName: "USER LEFT ROOM";
  payload: {
    roomId: string;
    username: string;
  };
};
