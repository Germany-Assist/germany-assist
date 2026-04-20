import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Banknote,
  Calendar,
  Plus,
  Trash2,
  Clock,
  Users,
} from "lucide-react";

const StepTypeAndPricing = ({ data, onUpdate, onNext, onBack }) => {
  // Logic: Ensure we have at least one valid entry based on the type
  const isInvalid =
    !data.type ||
    (data.type === "oneTime" &&
      (!data.variants ||
        data.variants.length === 0 ||
        data.variants.some(
          (v) => !v.label || v.price <= 0 || v.deliveryTime < 0,
        ))) ||
    (data.type === "timeline" &&
      (!data.timelines ||
        data.timelines.length === 0 ||
        data.timelines.some(
          (t) =>
            !t.label || !t.startDate || t.price <= 0 || t.maxParticipants <= 0,
        )));

  // Helper to add new items
  const addItem = () => {
    if (data.type === "oneTime") {
      const newVariants = [
        ...(data.variants || []),
        { label: "", price: "", deliveryTime: "" },
      ];
      onUpdate({ variants: newVariants });
    } else {
      const newTimelines = [
        ...(data.timelines || []),
        {
          label: "",
          startDate: "",
          endDate: "",
          price: "",
          maxParticipants: 1,
        },
      ];
      onUpdate({ timelines: newTimelines });
    }
  };

  // Helper to remove items
  const removeItem = (index) => {
    if (data.type === "oneTime") {
      onUpdate({ variants: data.variants.filter((_, i) => i !== index) });
    } else {
      onUpdate({ timelines: data.timelines.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Pricing & Structure
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          Define how you offer this service and your capacity.
        </p>
      </div>

      {/* 1. Service Type Selection */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onUpdate({ type: "oneTime", timelines: [] })}
          className={`flex-1 p-4 rounded-2xl border flex flex-col gap-2 transition-all text-left ${
            data.type === "oneTime"
              ? "border-accent bg-accent/5 ring-2 ring-accent/20"
              : "border-light-700 dark:border-white/10"
          }`}
        >
          <Banknote
            className={
              data.type === "oneTime" ? "text-accent" : "text-slate-400"
            }
          />
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              One-Time
            </p>
            <p className="text-xs text-slate-500">Fixed Tiers & Delivery</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onUpdate({ type: "timeline", variants: [] })}
          className={`flex-1 p-4 rounded-2xl border flex flex-col gap-2 transition-all text-left ${
            data.type === "timeline"
              ? "border-accent bg-accent/5 ring-2 ring-accent/20"
              : "border-light-700 dark:border-white/10"
          }`}
        >
          <Calendar
            className={
              data.type === "timeline" ? "text-accent" : "text-slate-400"
            }
          />
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              Timeline
            </p>
            <p className="text-xs text-slate-500">Schedules & Capacity</p>
          </div>
        </button>
      </div>

      {/* 2. Dynamic Fields Section */}
      <div className="space-y-4">
        {data.type === "oneTime" && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Service Variants
            </label>
            {(data.variants || []).map((variant, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start bg-light-900/10 p-3 rounded-2xl border border-light-700 dark:border-white/5"
              >
                <div className="flex-1 space-y-3">
                  <input
                    placeholder="Variant Name (e.g. Basic Package)"
                    className="w-full p-2 bg-transparent border-b border-light-700 dark:border-white/10 text-slate-900 dark:text-white focus:border-accent outline-none"
                    value={variant.label}
                    onChange={(e) => {
                      const v = [...data.variants];
                      v[idx].label = e.target.value;
                      onUpdate({ variants: v });
                    }}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Clock
                        size={14}
                        className="absolute left-2 top-3 text-slate-400"
                      />
                      <input
                        type="number"
                        placeholder="Delivery Time in Days (e.g. 3) leave zero for unknown delivery times"
                        className="w-full pl-8 p-2 text-sm border border-light-700 dark:border-white/10 rounded-lg bg-transparent text-slate-900 dark:text-white focus:border-accent outline-none"
                        value={variant.deliveryTime}
                        onChange={(e) => {
                          const v = [...data.variants];
                          v[idx].deliveryTime = parseFloat(e.target.value) || 0;
                          onUpdate({ variants: v });
                        }}
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-24 p-2 text-sm border border-light-700 dark:border-white/10 rounded-lg bg-transparent text-slate-900 dark:text-white focus:border-accent outline-none"
                      value={variant.price}
                      onChange={(e) => {
                        const v = [...data.variants];
                        v[idx].price = parseFloat(e.target.value) || 0;
                        onUpdate({ variants: v });
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="mt-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {data.type === "timeline" && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Service Timelines
            </label>
            {(data.timelines || []).map((timeline, idx) => (
              <div
                key={idx}
                className="p-5 border border-light-700 dark:border-white/10 rounded-2xl space-y-4 relative group bg-light-900/20 dark:bg-white/5"
              >
                <div className="flex gap-4">
                  <input
                    placeholder="Batch label (e.g. Winter Intake)"
                    className="flex-1 bg-transparent border-b border-light-700 dark:border-white/10 text-slate-900 dark:text-white font-bold py-2 focus:border-accent outline-none"
                    value={timeline.label}
                    onChange={(e) => {
                      const t = [...data.timelines];
                      t[idx].label = e.target.value;
                      onUpdate({ timelines: t });
                    }}
                  />
                  <div className="relative w-[25%]">
                    <Users
                      size={14}
                      className="absolute left-0 top-3 text-slate-400"
                    />
                    <input
                      type="number"
                      placeholder="Max Ppl"
                      className="w-full bg-transparent border-b border-light-700 dark:border-white/10 text-slate-900 dark:text-white font-bold py-2 pl-5 focus:border-accent outline-none"
                      value={timeline.maxParticipants}
                      onChange={(e) => {
                        const t = [...data.timelines];
                        t[idx].maxParticipants = parseInt(e.target.value) || 0;
                        onUpdate({ timelines: t });
                      }}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-[20%] bg-transparent border-b border-light-700 dark:border-white/10 text-slate-900 dark:text-white font-bold py-2 focus:border-accent outline-none"
                    value={timeline.price}
                    onChange={(e) => {
                      const t = [...data.timelines];
                      t[idx].price = parseFloat(e.target.value) || 0;
                      onUpdate({ timelines: t });
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Start
                    </p>
                    <input
                      type="date"
                      className="w-full bg-transparent text-sm dark:text-white outline-none"
                      value={timeline.startDate}
                      onChange={(e) => {
                        const t = [...data.timelines];
                        t[idx].startDate = e.target.value;
                        onUpdate({ timelines: t });
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      End
                    </p>
                    <input
                      type="date"
                      className="w-full bg-transparent text-sm dark:text-white outline-none"
                      value={timeline.endDate}
                      onChange={(e) => {
                        const t = [...data.timelines];
                        t[idx].endDate = e.target.value;
                        onUpdate({ timelines: t });
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Deadline
                    </p>
                    <input
                      type="date"
                      className="w-full bg-transparent text-sm dark:text-white outline-none"
                      value={timeline.deadlineDate}
                      onChange={(e) => {
                        const t = [...data.timelines];
                        t[idx].deadlineDate = e.target.value;
                        onUpdate({ timelines: t });
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {data.type && (
          <button
            type="button"
            onClick={addItem}
            className="w-full py-4 border-2 border-dashed border-light-700 dark:border-white/10 rounded-2xl text-slate-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
          >
            <Plus size={18} /> Add{" "}
            {data.type === "oneTime" ? "Variant" : "Timeline"}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4 border-t border-light-700 dark:border-white/5">
        <button
          type="button"
          onClick={onBack}
          className="p-4 rounded-2xl border border-light-700 dark:border-white/10 text-slate-400 hover:bg-light-900 dark:hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          disabled={isInvalid}
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white disabled:opacity-20 text-white dark:text-black font-bold py-4 rounded-2xl transition-all shadow-xl hover:bg-accent hover:text-white active:scale-95"
        >
          Next: Media <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default StepTypeAndPricing;
