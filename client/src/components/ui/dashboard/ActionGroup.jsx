import { Loader2 } from "lucide-react";
import React from "react";

const VARIANTS = {
  // Bold but clean
  primary: "bg-[#024CEE] text-white hover:bg-[#0341cc] shadow-lg shadow-blue-200",
  secondary: "border-2 border-zinc-100 hover:bg-zinc-50 text-zinc-600",

  // High-Vibrancy Light Variants
  success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  info: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
  rose: "bg-rose-100 text-rose-700 hover:bg-rose-200",

  // High-Vibrancy Warning/Danger
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
  alert: "bg-amber-100 text-amber-700 hover:bg-amber-200",

  // Subtitle/Ghost
  ghost: "bg-transparent hover:bg-zinc-100 text-zinc-500 font-bold",
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
