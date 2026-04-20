import React from "react";
import { Search } from "lucide-react";

export const FilterContainer = ({
  children,
  searchValue,
  onSearchChange,
  placeholder,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
    {/* Common Search Input */}
    <div className="relative col-span-1 md:col-span-2">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        size={14}
      />
      <input
        placeholder={placeholder || "Search..."}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-2 ring-blue-500/20 transition-all"
      />
    </div>
    {/* Slots for Dropdowns and Toggles */}
    {children}
  </div>
);

export const FilterToggle = ({ label, active, onClick, variant = "blue" }) => {
  const themes = {
    emerald: active
      ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
      : "border-zinc-200 dark:border-white/5 text-zinc-400",
    blue: active
      ? "bg-blue-500/10 border-blue-500 text-blue-500"
      : "border-zinc-200 dark:border-white/5 text-zinc-400",
    red: active
      ? "bg-red-500/10 border-red-500 text-red-500"
      : "border-zinc-200 dark:border-white/5 text-zinc-400",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${themes[variant]}`}
    >
      {label}
    </button>
  );
};

export default FilterContainer;
