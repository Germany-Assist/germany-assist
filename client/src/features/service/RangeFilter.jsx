import React, { useState, useRef, useEffect } from "react";

function RangeFilter({ label, minKey, maxKey, filters, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Button glows cyan if any value is entered
  const isActive = filters[minKey] || filters[maxKey];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border transition-all duration-300 ${
          isOpen || isActive
            ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            : "border-white/10"
        }`}
      >
        <span className="text-sm font-semibold text-slate-300 group-hover:text-white">
          {label}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 right-0 min-w-[240px] bg-[#1a1d23]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-5 z-[110]">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Set {label} Range
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters[minKey]}
                onChange={(e) => onUpdate(minKey, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none"
              />
              <span className="text-slate-600">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters[maxKey]}
                onChange={(e) => onUpdate(maxKey, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-cyan-500 text-black text-[10px] font-bold py-2 rounded-lg uppercase"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RangeFilter;
