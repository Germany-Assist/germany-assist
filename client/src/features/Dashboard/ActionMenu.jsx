import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";

const ActionMenu = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative text-right">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-md hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-36 rounded-lg border bg-white shadow-md">
          {actions
            .filter((i) => i.label)
            .map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700"
                }`}
              >
                {action.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
//
