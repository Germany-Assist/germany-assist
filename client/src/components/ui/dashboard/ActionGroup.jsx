import { Loader2 } from "lucide-react";
import React from "react";

const VARIANTS = {
  // Bold but clean
  primary:
    "bg-zinc-900 dark:bg-white dark:text-black text-white hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-200 dark:shadow-none",
  secondary:
    "border-2 border-zinc-100 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400",

  // High-Vibrancy Light Variants
  success:
    "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30",
  info: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30",
  rose: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30",

  // High-Vibrancy Warning/Danger
  danger:
    "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30",
  alert:
    "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30",

  // Subtitle/Ghost
  ghost:
    "bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 font-bold",
};

const BASE_STYLES =
  "px-2 py-2 text-[10px] font-black uppercase rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-widest";

const ActionGroup = ({ actions }) => {
  return (
    <div className="flex flex-wrap justify-end gap-3">
      {actions.map((action, index) => {
        // Handle logic where 'show' might be undefined (default to true)
        if (action.show === false) return null;

        const variantClass = VARIANTS[action.variant] || VARIANTS.secondary;

        return (
          <button
            key={action.label || index}
            disabled={action.loading || action.disabled}
            onClick={action.onClick}
            className={`${BASE_STYLES} ${variantClass} ${action.className || ""}`}
          >
            {action.loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActionGroup;
