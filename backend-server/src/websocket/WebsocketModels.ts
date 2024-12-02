import WebSocket, { Server, WebSocket as WS } from "ws";

export type WSUser = {
  ws: WS;
  id: number;
  username: string;
};

export type Room = {
  users: Array<WSUser>;
};

export interface ChatMessage {
  roomId: string;
  username: string;
  activity: string;
  message?: string;
  chatroomName?: string;
  isOpen?: boolean;
  password?: string;
  token: string;
}
