import {
  X,
  Scale,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  Send,
} from "lucide-react";
import React, { useState } from "react";
//TODO
// im gonna fetch this later on from the backend
const DISPUTE_REASONS = [
  "Failed to deliver within the agreement period",
  "Failed to deliver agreement criteria",
  "Privacy Concern",
  "Other",
];

function DisputeModal({ isOpen, onClose, onSubmit, itemName = "this post" }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reason,
      description: description.trim(),
      timestamp: new Date().toISOString(),
    });
    // Reset and close
    setReason("");
    setDescription("");
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
        {/* Header Section */}
        <div className="bg-amber-500/10 p-8 pb-12">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-amber-900/40 hover:bg-amber-500/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 mb-4 animate-pulse">
              <Scale size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              Open a Dispute
            </h3>
            <p className="text-slate-500 text-sm mt-3 max-w-[280px]">
              You are disputing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {itemName}
              </span>
              . Our team will review your claim.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 -mt-6 bg-white dark:bg-zinc-900 rounded-t-[32px] relative z-20"
        >
          {/* Reason Select */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              <AlertTriangle size={12} /> Primary Reason
            </label>
            <div className="relative">
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-4 pr-10 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-amber-500 outline-none appearance-none transition-all text-slate-900 dark:text-white font-bold"
              >
                <option value="" disabled>
                  Select a reason...
                </option>
                {DISPUTE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              <MessageSquare size={12} /> Detailed Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-800 outline-none transition-all text-slate-900 dark:text-white resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all active:scale-[0.97] shadow-lg shadow-amber-500/20"
            >
              Submit <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DisputeModal;
