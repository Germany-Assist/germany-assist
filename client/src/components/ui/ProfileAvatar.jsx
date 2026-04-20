import React, { useEffect, useState } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";

export default function ProfileAvatar({ navDir, className, showBadge = false }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  //const [notificationCount, setNotificationCount] = useState(0);
  const { unreadCount } = useNotifications();
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    setImageUrl(profile?.image);
    setImageError(false);
  }, [profile]);

  const initials =
    `${profile?.firstName?.charAt(0) || ""}${
      profile?.lastName?.charAt(0) || ""
    }`.toUpperCase() || "??";

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Outer Glow Container */}
      <div
        onClick={() => navDir && navigate(navDir)}
        className={`relative p-1 rounded-full bg-gradient-to-tr from-light-700/50 to-transparent dark:from-white/10 dark:to-transparent group cursor-pointer transition-all duration-500 ${
          className || "w-16 h-16"
        }`}
      >
        {/* Notification Badge */}
        {showBadge && unreadCount  > 0 && (
          <div className="absolute -top-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-600  text-[10px] font-bold text-white text-xs shadow-lg  ring-2 ring-white dark:ring-dark-900 animate-in zoom-in duration-300">
            {unreadCount  > 9 ? "9+" : unreadCount }
          </div>
        )}

        {/* Main Avatar Body */}
        <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-dark-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          {imageUrl && !imageError ? (
            <img
              alt="Profile Avatar"
              src={imageUrl}
              onError={() => setImageError(true)}
              className="w-full h-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-50 dark:bg-dark-800 flex items-center justify-center transition-colors duration-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
              <span className="text-slate-400 dark:text-slate-500 font-black text-sm tracking-[0.1em] group-hover:text-blue-600 dark:group-hover:text-accent transition-colors">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Online Status Dot */}
        <div className="absolute bottom-1 right-1 z-10 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-dark-900 rounded-full shadow-lg" />
      </div>
    </div>
  );
}
