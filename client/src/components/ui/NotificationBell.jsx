import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationBell = ({ className }) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const notificationsPath = "/dashboard/notifications";
  const handleClick = () => {
    navigate(notificationsPath);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer group ${className}`}
    >
      {/* Bell Icon */}
      <Bell
        size={32}
        className={`transition-all duration-300 
        ${
          unreadCount > 0
            ? "text-red-500 animate-pulse"
            : "text-zinc-600 dark:text-zinc-300"
        }
        group-hover:scale-110`}
      />

      {/* Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shadow-md ring-2 ring-white dark:ring-zinc-900">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}

export default NotificationBell