import React from "react";
import {
  MessageSquare,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Users,
} from "lucide-react";

const iconMap = {
  message: { icon: MessageSquare, color: "text-red-600", bg: "bg-red-100" },
  order: { icon: ShoppingBag, color: "text-sky-600", bg: "bg-sky-100" },
  event: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
  verification: {
    icon: ShieldCheck,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  default: { icon: Users, color: "text-zinc-600", bg: "bg-zinc-100" },
};

export function ActionFeed({
  items = [],
  onItemClick,
  emptyMessage = "No recent activity",
}) {
  if (!items.length) {
    return (
      <div className="py-8 text-center text-zinc-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, idx) => {
        const { icon: Icon, color, bg } = iconMap[item.type] || iconMap.default;

        return (
          <div
            key={item.id || idx}
            onClick={() => onItemClick?.(item)}
            className="flex items-start gap-2.5 py-2.5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 cursor-pointer rounded-lg transition-colors"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}
            >
              <Icon size={14} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-zinc-900 leading-snug line-clamp-2">
                {item.text}
              </p>
              {item.urgent && (
                <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                  {item.urgent}
                </span>
              )}
            </div>
            <span className="text-[10.5px] text-zinc-400 flex-shrink-0">
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ActionFeed;
