import { X, Send, Pin, Layout, AlignLeft, Globe } from "lucide-react";
import React, { useState } from "react";

function PostCreationModal({ isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      description: description.trim(),
      isPinned,
    });
    setDescription("");
    setIsPinned(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg rounded-[32px] bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layout size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                New Post
              </h3>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                <Globe size={12} /> Public Timeline
              </p>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <AlignLeft size={12} /> What's on your mind?
            </label>
            <textarea
              autoFocus
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Start typing your story..."
              className="w-full min-h-[160px] p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 outline-none transition-all text-slate-900 dark:text-white resize-none text-lg"
            />
          </div>

          {/* Settings / Pinned State */}
          <div
            onClick={() => setIsPinned(!isPinned)}
            className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer mb-8 ${
              isPinned
                ? "border-amber-500/50 bg-amber-500/5"
                : "border-slate-100 dark:border-zinc-800 bg-transparent hover:border-slate-200 dark:hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2.5 rounded-xl transition-all ${
                  isPinned
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-400 group-hover:text-slate-600"
                }`}
              >
                <Pin size={20} className={isPinned ? "rotate-45" : ""} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Pin this post
                </p>
                <p className="text-xs text-slate-500">
                  Feature it at the top of your feed
                </p>
              </div>
            </div>

            {/* Custom Toggle UI */}
            <div
              className={`w-12 h-6 rounded-full transition-colors relative ${isPinned ? "bg-amber-500" : "bg-slate-200 dark:bg-zinc-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPinned ? "left-7" : "left-1"}`}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full group flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all active:scale-[0.97] shadow-xl"
          >
            Share to Timeline
            <Send
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostCreationModal;
