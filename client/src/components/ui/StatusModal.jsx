import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  Info,
  Trash2,
  MessageSquare,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const STYLES = {
  success: {
    icon: <CheckCircle2 size={48} className="animate-bounce" />,
    bgIcon: "bg-emerald-500/10 text-emerald-500",
    title: "Success!",
  },
  error: {
    icon: <AlertCircle size={48} className="animate-pulse" />,
    bgIcon: "bg-rose-500/10 text-rose-500",
    title: "System Error",
  },
  warning: {
    icon: <AlertCircle size={48} />,
    bgIcon: "bg-amber-500/10 text-amber-500",
    title: "Wait a moment",
  },
  info: {
    icon: <Info size={48} />,
    bgIcon: "bg-cyan-500/10 text-cyan-500",
    title: "Information",
  },
  operation: {
    icon: <Shield size={48} className="animate-pulse" />,
    bgIcon: "bg-red-500/10 text-red-600",
    title: "Confirm Operation",
  },
  input: {
    icon: <MessageSquare size={48} />,
    bgIcon: "bg-blue-500/10 text-blue-500",
    title: "Action Required",
  },
};

/**
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Function to close the modal.
 * @param {function} onConfirm Function to call when confirming.
 * @param {string} type The type of the status modal.
 * @param {string} title Custom title for the modal (optional).
 * @param {string} message The message to display.
 * @param {string} buttonText The text of the main button.
 * @param {string} secondaryButtonText The text of the secondary button.
 * @param {number} autoCloseMs Time to auto-close.
 * @param {boolean} showInput Whether to show textarea.
 * @param {string} inputPlaceholder Placeholder for textarea.
 */
function StatusModal({
  isOpen,
  onClose,
  onConfirm,
  type = "success",
  title, // Added title prop
  message = "",
  buttonText = "Continue",
  secondaryButtonText = "Cancel",
  autoCloseMs = 0,
  showInput = false,
  inputPlaceholder = "Enter reason...",
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) setInputValue("");

    if (isOpen && autoCloseMs > 0) {
      const timer = setTimeout(() => onClose(), autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const currentStyle = STYLES[type] || STYLES.success;
  const isConfirmation = !!onConfirm;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl p-8 animate-in zoom-in-95 duration-200 border border-zinc-100 dark:border-white/5">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${currentStyle.bgIcon}`}
          >
            {currentStyle.icon}
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
            {title || currentStyle.title}{" "}
            {/* Uses passed title or default from STYLES */}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            {message}
          </p>

          {showInput && (
            <div className="w-full mb-6">
              <textarea
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-white/5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-500/20 transition-all resize-none"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full font-black uppercase tracking-widest text-[10px]">
            {isConfirmation && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                {secondaryButtonText}
              </button>
            )}

            <button
              disabled={showInput && !inputValue.trim()}
              onClick={() => (onConfirm ? onConfirm(inputValue) : onClose())}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-30
                ${
                  type === "operation" || type === "input"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg shadow-black/10"
                }`}
            >
              {buttonText} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusModal;
