import React, { useState, useRef, useEffect } from "react";

function FilterTrigger({ label, options = [], onSelect, activeValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const activeLabel = options.find((opt) => opt.title === activeValue)?.label;

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
          isOpen || activeValue
            ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            : "border-white/10"
        }`}
      >
        <span className="text-sm font-semibold text-slate-300 group-hover:text-white">
          {activeLabel || label}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
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
        <div className="absolute top-full mt-3 left-0 min-w-[260px] bg-[#1a1d23]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-[100]">
          {/* APPLYING THE COOL SCROLLBAR HERE */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
            <button
              onClick={() => {
                onSelect("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              Reset {label}
            </button>

            <div className="h-[1px] bg-white/5 my-1 mx-2" />

            {options.map((opt) => (
              <button
                key={opt.title}
                onClick={() => {
                  onSelect(opt.title);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all ${
                  activeValue === opt.title
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterTrigger;
