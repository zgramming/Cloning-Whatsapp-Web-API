import { Socket } from "socket.io";

export interface SocketIOChannelInterface {
  [userId: string]: Socket | undefined;
}
