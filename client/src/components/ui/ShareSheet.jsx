import React, { useState } from "react";

const ShareSheet = ({ isOpen, onClose, url, title }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-light-950/40 backdrop-blur-md dark:bg-black/60 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200 dark:bg-dark-900 dark:ring-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-light-100 dark:hover:bg-dark-800 transition-colors text-slate-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="px-8 pt-10 pb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Share {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Invite others to view this service.
          </p>
        </div>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-4 gap-4 px-8 py-4">
          {[
            {
              name: "WhatsApp",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
            },
            {
              name: "Messenger",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
              icon: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
            },
            {
              name: "X",
              color: "text-slate-900 dark:text-white",
              bg: "bg-slate-900/10 dark:bg-white/10",
              icon: "M4 4l11.7 16H16l-11.7-16z M4 20l6.7-9.1M13.3 9l6.7-9",
            },
            {
              name: "More",
              color: "text-slate-500",
              bg: "bg-slate-500/10",
              icon: "M12 12h.01M19 12h.01M5 12h.01",
            },
          ].map((app) => (
            <button
              key={app.name}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-110 active:scale-90 ${app.bg} ${app.color}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d={app.icon} />
                </svg>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy Link Input Bar */}
        <div className="mt-4 bg-light-50 p-8 dark:bg-dark-800/40">
          <div className="flex items-center gap-2 rounded-2xl border border-light-200 bg-white p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-white/5 dark:bg-dark-900">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-transparent px-3 text-sm text-slate-600 outline-none dark:text-slate-400"
            />
            <button
              onClick={handleCopy}
              className={`min-w-[80px] rounded-xl px-4 py-2 text-sm font-bold text-white transition-all active:scale-95 ${
                copied ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSheet;
