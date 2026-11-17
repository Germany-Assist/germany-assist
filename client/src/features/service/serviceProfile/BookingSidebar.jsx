import {
  Mail,
  Star,
  Loader2,
  CreditCard,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const BookingSidebar = ({
  serviceType,
  options = [],
  purchasedItems = [],
  category,
  rating,
  providerEmail,
  onBuy,
  isProcessing,
  onNavigate,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (options.length > 0 && !selectedId) {
      setSelectedId(options[0].id);
    }
  }, [options, selectedId]);

  const selectedOption = options.find((o) => o.id === selectedId) || options[0];
  // Check if the selected option is already in purchasedItems
  const isAlreadyPurchased = purchasedItems.some((item) => item === selectedId);

  const displayPrice = selectedOption?.price || 0;

  return (
    <div className="sticky top-32 bg-white border border-light-700 rounded-[2.5rem] p-8 shadow-2xl shadow-light-900/50 transition-all duration-500">
      {/* Price and Rating Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-4xl font-black text-slate-900">
            ${displayPrice}
          </span>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
            {serviceType === "timeline" ? "Per Schedule" : "Selected Variant"}
          </p>
        </div>
        <div className="flex items-center bg-light-50 px-3 py-1.5 rounded-xl border border-light-200">
          <Star size={14} className="mr-1.5 fill-accent text-accent" />
          <span className="text-sm font-bold text-slate-900">
            {rating > 0 ? rating : "New"}
          </span>
        </div>
      </div>

      {/* Selection Area */}
      <div className="space-y-3 mb-8">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          Choose {serviceType === "timeline" ? "Schedule" : "Package"}
        </label>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {options &&
            purchasedItems &&
            options.length > 0 &&
            options.map((option) => {
              const isItemPurchased = purchasedItems.some(
                (item) => item?.id === option?.id,
              );
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all relative group ${
                    selectedId === option.id
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                      : "border-light-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-bold text-sm ${
                            selectedId === option.id
                              ? "text-accent"
                              : "text-slate-700"
                          }`}
                        >
                          {option.label}
                        </p>
                        {isItemPurchased && (
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500"
                          />
                        )}
                      </div>

                      {serviceType === "timeline" && option.startDate && (
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(option.startDate).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}{" "}
                          -{" "}
                          {new Date(option.endDate).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-black text-slate-900">
                        ${option.price}
                      </p>
                    </div>
                  </div>

                  {selectedId === option.id && (
                    <div className="absolute top-0 right-0 p-1 bg-accent text-white rounded-bl-lg">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Dynamic Action Button */}
      {isAlreadyPurchased && serviceType == "timeline" ? (
        <button
          onClick={() => onNavigate(selectedId)}
          className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all active:scale-[0.98] mb-6 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group hover:bg-emerald-600"
        >
          <span>View Timeline</span>
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      ) : (
        <button
          onClick={() => onBuy(selectedOption)}
          disabled={isProcessing || !selectedId}
          className="w-full bg-[#024CEE] text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all active:scale-[0.98] mb-6 shadow-xl flex items-center justify-center gap-3 group hover:bg-[#0341cc] disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CreditCard
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Book Now</span>
            </>
          )}
        </button>
      )}

      {/* Footer Details */}
      <div className="space-y-4 pt-6 border-t border-light-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-tighter">
            Category
          </span>
          <span className="font-bold text-slate-700">
            {category?.label || "General"}
          </span>
        </div>

        {isAlreadyPurchased && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-[10px] text-emerald-600 font-bold uppercase text-center">
              You already own this session
            </p>
          </div>
        )}

        {providerEmail && (
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-4 italic">
            <Mail size={12} />
            <span className="truncate">Contact: {providerEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSidebar;
