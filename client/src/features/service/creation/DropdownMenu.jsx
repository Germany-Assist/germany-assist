import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, ArrowDown } from "lucide-react";

const DropdownMenu = ({
  categories = [],
  selectedValue,
  onSelect,
  placeholder = "Select Option",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);

  // Find the label of the currently selected item from the list
  const selectedItem = categories.find((c) => c.id === selectedValue);

  const handleScrollDetection = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show arrow if there is more than 5px left to scroll
      setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Check scroll status immediately on open
      const timer = setTimeout(handleScrollDetection, 50);

      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  return (
    <div
      className={`relative z-30 w-full transition-opacity duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between p-4 rounded-2xl border text-sm font-semibold transition-all duration-300
          ${
            isOpen
              ? "border-accent ring-4 ring-accent/10"
              : "border-light-700 dark:border-white/10 shadow-sm"
          }
          bg-transparent text-slate-900 dark:text-white 
          ${!disabled && "hover:border-slate-300 dark:hover:border-white/20 active:scale-[0.98]"}
        `}
      >
        <span className="truncate pr-2">
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-accent" : "text-slate-400"
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-light-700 dark:border-white/10 bg-white dark:bg-dark-950 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div
            ref={scrollRef}
            onScroll={handleScrollDetection}
            className="p-1 max-h-60 overflow-y-auto no-scrollbar scroll-smooth"
          >
            {categories.length > 0 ? (
              categories.map((cat) => {
                const isSelected = selectedValue === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelect(cat);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? "bg-accent/10 text-accent"
                          : "text-slate-600 dark:text-slate-400 hover:bg-light-900/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {isSelected && (
                      <Check size={16} className="text-accent flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 italic text-center">
                No options available
              </div>
            )}
          </div>

          {showScrollIndicator && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-dark-950 to-transparent flex items-end justify-center pb-1">
              <ArrowDown size={14} className="text-accent animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
