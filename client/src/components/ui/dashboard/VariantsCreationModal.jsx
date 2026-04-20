import React, { useState, useMemo } from "react";
import {
  X,
  Layers,
  Check,
  Tag,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";

function VariantsCreationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    label: "",
    price: "",
    deliveryTime: "",
  });
  const [touched, setTouched] = useState({});

  // 1. Define Frontend Validation Rules (Matching your Backend variantValidator)
  const errors = useMemo(() => {
    return {
      label:
        formData.label.trim().length < 3
          ? "Label must be at least 3 characters"
          : null,
      price:
        !formData.price || parseFloat(formData.price) < 1
          ? "Minimum price is $1"
          : null,
      deliveryTime:
        !formData.deliveryTime || parseInt(formData.deliveryTime) < 1
          ? "Minimum 1 day required"
          : null,
    };
  }, [formData]);

  const isFormValid = !errors.label && !errors.price && !errors.deliveryTime;

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({
        label: formData.label.trim(),
        price: parseFloat(formData.price),
        deliveryTime: parseInt(formData.deliveryTime),
      });
      setFormData({ label: "", price: "", deliveryTime: "" });
      setTouched({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-[32px] bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                New Variant
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Configure tier pricing and delivery
              </p>
            </div>
          </div>

          {/* Label Input */}
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Tag size={12} /> Tier Name
            </label>
            <input
              autoFocus
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              onBlur={() => handleBlur("label")}
              placeholder="e.g. Premium Package"
              className={`w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 outline-none transition-all font-bold ${
                touched.label && errors.label
                  ? "border-red-500/50"
                  : "border-transparent focus:border-indigo-500"
              }`}
            />
            {touched.label && errors.label && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <AlertCircle size={10} /> {errors.label}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {/* Price Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <DollarSign size={12} /> Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="0.00"
                className={`w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 outline-none transition-all font-bold ${
                  touched.price && errors.price
                    ? "border-red-500/50"
                    : "border-transparent focus:border-indigo-500"
                }`}
              />
              {touched.price && errors.price && (
                <p className="text-[9px] font-bold text-red-500">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Delivery Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <Clock size={12} /> Days
              </label>
              <input
                type="number"
                value={formData.deliveryTime}
                onChange={(e) => handleChange("deliveryTime", e.target.value)}
                onBlur={() => handleBlur("deliveryTime")}
                placeholder="Days"
                className={`w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 outline-none transition-all font-bold ${
                  touched.deliveryTime && errors.deliveryTime
                    ? "border-red-500/50"
                    : "border-transparent focus:border-indigo-500"
                }`}
              />
              {touched.deliveryTime && errors.deliveryTime && (
                <p className="text-[9px] font-bold text-red-500">
                  {errors.deliveryTime}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Action Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-[20px] font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-xl ${
              isFormValid
                ? "bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50 shadow-none"
            }`}
          >
            Deploy Variant{" "}
            <Check size={18} className={isFormValid ? "animate-pulse" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default VariantsCreationModal;
