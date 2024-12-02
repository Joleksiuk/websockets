import WebSocket, { Server, WebSocket as WS } from "ws";

export type Room = {
  users: Set<WS>;
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
