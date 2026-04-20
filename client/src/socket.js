import { io } from "socket.io-client";
export const DROPLET_ORIGIN = import.meta.env.VITE_DROPLET_ORIGIN;
export const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const LOCAL_BACKEND_URL = import.meta.env.VITE_LOCAL_BACKEND_URL;

let SOCKET_ORIGIN = "";
let SOCKET_PATH = "";
if (NODE_ENV === "production") {
  SOCKET_ORIGIN = DROPLET_ORIGIN;
  SOCKET_PATH = "/backend/socket.io";
} else if (NODE_ENV === "staging") {
  SOCKET_ORIGIN = DROPLET_ORIGIN;
  SOCKET_PATH = "/backend/socket.io";
} else {
  SOCKET_ORIGIN = LOCAL_BACKEND_URL;
  SOCKET_PATH = "/socket.io";
}

export const socket = io(SOCKET_ORIGIN, {
  path: SOCKET_PATH,
  autoConnect: false,
});
