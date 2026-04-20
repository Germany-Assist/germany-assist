import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { accessToken, logOut } = useAuth();

  useEffect(() => {
    if (accessToken) {
      socket.auth = { token: accessToken };
      socket.connect();
      socket.on("notification", (d) => console.log(d));
      console.log("Socket connecting...");
    } else {
      socket.disconnect();
      console.log("Socket disconnected");
    }

    const handleAuthError = (err) => {
      console.log("Socket connection error:", err);
      if (err.message === "Unauthorized") {
        logOut(true);
      }
    };

    socket.on("connect_error", handleAuthError);

    return () => {
      socket.off("connect_error", handleAuthError);
      socket.disconnect();
    };
  }, [accessToken, logOut]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};
