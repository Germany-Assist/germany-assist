import React from "react";

const colors = {
  active: "bg-blue-500",
  pending: "bg-amber-500",
  completed: "bg-emerald-500",
  disputed: "bg-red-500",
  late: "bg-rose-500",
  cancelled: "bg-zinc-400",
};

export function StatusBreakdown({ items = [], onItemClick }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const color = colors[item.status] || colors.active;
        
        return (
          <div
            key={item.status || idx}
            onClick={() => onItemClick?.(item)}
            className="flex items-center gap-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="flex-1 text-[12px] text-zinc-900 dark:text-zinc-100">
              {item.label}
            </span>
            <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11.5px] font-semibold text-zinc-900 dark:text-zinc-100 min-w-[24px] text-right">
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StatusBreakdown;