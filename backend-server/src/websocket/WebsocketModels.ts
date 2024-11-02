import WebSocket, { Server, WebSocket as WS } from "ws";

export interface Room {
  users: Set<WS>;
  chatroomName: string;
  isOpen: boolean;
  password?: string;
}

export interface ChatMessage {
  roomId: string;
  username: string;
  activity: string;
  message?: string;
  chatroomName?: string;
  isOpen?: boolean;
  password?: string;
}
