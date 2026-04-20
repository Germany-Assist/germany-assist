import React, { useState, useRef, useEffect } from "react";

function SortFilter({ currentSort, currentOrder, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const options = [
    { label: "Price: Low to High", sort: "price", order: "asc" },
    { label: "Price: High to Low", sort: "price", order: "desc" },
    { label: "Top Rated", sort: "rating", order: "desc" },
    { label: "Newest", sort: "createdAt", order: "desc" },
  ];

  const activeLabel = options.find(
    (o) => o.sort === currentSort && o.order === currentOrder
  )?.label;

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
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white transition-all"
      >
        {activeLabel || "Sort"}
      </button>
      {isOpen && (
        <div className="absolute top-full mt-3 right-0 min-w-[200px] bg-[#1a1d23] border border-white/10 rounded-2xl shadow-2xl p-2 z-[110]">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                onUpdate("sort", opt.sort);
                onUpdate("order", opt.order);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                currentSort === opt.sort && currentOrder === opt.order
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortFilter;
