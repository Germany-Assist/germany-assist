import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useProfile } from "./ProfileContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const socket = useSocket();
  const { profile, fetchProfile } = useProfile();
  const { setProfile } = useProfile();
  const [latestNotification, setLatestNotification] = useState(null);
  const unreadCount = profile?.unReadNotifications || 0;
  
  
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      setLatestNotification(data);
     
        setProfile(prev => ({
        ...prev,
        unReadNotifications: (prev?.unReadNotifications || 0) + 1
        }));
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, fetchProfile]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        latestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};

