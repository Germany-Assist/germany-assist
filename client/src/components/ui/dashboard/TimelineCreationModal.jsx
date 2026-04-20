import React, { useState, useMemo } from "react";
import {
  X,
  Calendar,
  Check,
  Tag,
  DollarSign,
  Users,
  Clock,
  Timer,
} from "lucide-react";

function TimelineModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    label: "",
    price: "",
    maxParticipants: "", // Replaced limit
    startDate: "",
    endDate: "",
    deadlineDate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Logic Validation mirroring your backend constraints
  const validation = useMemo(() => {
    const { label, price, maxParticipants, deadlineDate, startDate, endDate } =
      formData;
    const errors = {};

    if (label && (label.length < 3 || label.length > 100))
      errors.label = "Label: 3-100 characters";
    if (price && parseFloat(price) < 1) errors.price = "Price: Min $1";
    if (maxParticipants && parseInt(maxParticipants) < 1)
      errors.maxParticipants = "Min 1 participant";

    // Date Logic Checks
    if (deadlineDate && startDate) {
      if (new Date(startDate) <= new Date(deadlineDate)) {
        errors.startDate = "Start must be after registration deadline";
      }
    }
    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        errors.endDate = "End must be after start date";
      }
    }

    const isComplete =
      label && price && maxParticipants && deadlineDate && startDate && endDate;
    const hasErrors = Object.keys(errors).length > 0;

    return { errors, isValid: isComplete && !hasErrors };
  }, [formData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation.isValid) return;

    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
      maxParticipants: parseInt(formData.maxParticipants) || 0,
    });
    setFormData({
      label: "",
      price: "",
      maxParticipants: "",
      startDate: "",
      endDate: "",
      deadlineDate: "",
    });
    onClose();
  };

  const errorTextStyle =
    "text-[10px] font-bold text-red-500 mt-1 animate-in fade-in slide-in-from-top-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Add Timeline
              </h3>
              <p className="text-zinc-500 text-xs font-medium flex items-center gap-1">
                <Clock size={12} /> Schedule & Capacity
              </p>
            </div>
          </div>

          {/* Label Input */}
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Tag size={12} /> Batch Label
            </label>
            <input
              autoFocus
              required
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="e.g. Winter Cohort 2026"
              className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-800 outline-none transition-all text-zinc-900 dark:text-white font-bold"
            />
            {validation.errors.label && (
              <p className={errorTextStyle}>{validation.errors.label}</p>
            )}
          </div>

          {/* Price & Participants Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <DollarSign size={12} /> Price
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-white font-bold"
              />
              {validation.errors.price && (
                <p className={errorTextStyle}>{validation.errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <Users size={12} /> Capacity
              </label>
              <input
                type="number"
                required
                value={formData.maxParticipants}
                onChange={(e) =>
                  handleChange("maxParticipants", e.target.value)
                }
                placeholder="Max Pax"
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-white font-bold"
              />
              {validation.errors.maxParticipants && (
                <p className={errorTextStyle}>
                  {validation.errors.maxParticipants}
                </p>
              )}
            </div>
          </div>

          {/* Dates Section - Light Tints */}
          <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-[28px] border border-zinc-100 dark:border-white/5 space-y-5 mb-8">
            <div className="flex flex-col">
              <p className="text-[10px] uppercase font-black tracking-[0.15em] text-amber-600 mb-2 flex items-center gap-1.5">
                <Timer size={12} /> Registration Deadline
              </p>
              <input
                type="date"
                required
                className="w-full bg-transparent text-sm font-bold text-zinc-800 dark:text-white outline-none"
                value={formData.deadlineDate}
                onChange={(e) => handleChange("deadlineDate", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200/50 dark:border-white/10">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-2">
                  Start Date
                </p>
                <input
                  type="date"
                  required
                  className="w-full bg-transparent text-sm font-bold text-zinc-800 dark:text-white outline-none"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
                {validation.errors.startDate && (
                  <p className={errorTextStyle}>
                    {validation.errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-2">
                  End Date
                </p>
                <input
                  type="date"
                  required
                  className="w-full bg-transparent text-sm font-bold text-zinc-800 dark:text-white outline-none"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
                {validation.errors.endDate && (
                  <p className={errorTextStyle}>{validation.errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!validation.isValid}
            className={`w-full group flex items-center justify-center gap-3 py-5 rounded-[22px] font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
              validation.isValid
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none"
            }`}
          >
            Create Timeline
            <Check
              size={18}
              strokeWidth={3}
              className={validation.isValid ? "animate-pulse" : ""}
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default TimelineModal;
