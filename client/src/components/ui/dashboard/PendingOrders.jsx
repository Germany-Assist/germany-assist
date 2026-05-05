import React from "react";

const statusStyles = {
  pending: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  active: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  disputed: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  cancelled: { bg: "bg-zinc-100 text-zinc-500", dot: "bg-zinc-400" },
};

export function PendingOrders({ items = [], onItemClick, onViewAll, emptyMessage = "No pending orders" }) {
  if (!items.length) {
    return (
      <div className="py-8 text-center text-zinc-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.slice(0, 5).map((item, idx) => {
        const style = statusStyles[item.status] || statusStyles.pending;
        
        return (
          <div
            key={item.id || idx}
            onClick={() => onItemClick?.(item)}
            className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer rounded-lg transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {item.service}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {item.client} · #{item.orderId}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100">
                {item.amount}
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${style.bg}`}>
                <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                {item.status}
              </span>
            </div>
          </div>
        );
      })}

      {items.length > 5 && (
        <button
          onClick={onViewAll}
          className="mt-2 text-[11px] text-[#024CEE] font-medium hover:underline"
        >
          All {items.length} pending →
        </button>
      )}
    </div>
  );
}

export default PendingOrders;