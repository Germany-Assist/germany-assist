import { io } from "socket.io-client";
export const SOCKET_ORIGIN = import.meta.env.VITE_SOCKET_ORIGIN;
export const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH;

export const socket = io(SOCKET_ORIGIN, {
  path: SOCKET_PATH,
  autoConnect: false,
});
