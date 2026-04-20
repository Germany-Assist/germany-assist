import React from "react";
import { RotateCcw, AlertOctagon, X } from "lucide-react";

function FallbackUI({ error, onRetry }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with heavy blur to isolate the error */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-zinc-800">
        {/* Decorative Close (Optional based on your logic) */}
        <button
          onClick={onRetry}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-rose-500 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center justify-center text-center py-8">
          {/* Error Icon Circle */}
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon size={44} className="animate-pulse" />
          </div>

          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            Something went wrong
          </h3>

          {/* Error Message Box */}
          <div className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-zinc-800">
            <p className="text-sm font-mono text-rose-600 dark:text-rose-400 break-words">
              {error?.message || "An unexpected system error occurred."}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onRetry}
            className="group flex items-center gap-3 bg-rose-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            <RotateCcw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export default FallbackUI;
