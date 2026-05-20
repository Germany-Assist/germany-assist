import React from "react";
import { LayoutGrid, Upload } from "lucide-react";

export default function CategoryCard({ category, status = "pending" }) {
  const isActive = status === "active";

  return (
    <div className="border border-[#024CEE] rounded-lg p-3.5 transition-all cursor-pointer bg-blue-50/30">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center ${
            isActive ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          <span className="text-base">{category.icon}</span>
        </div>
        <span className="text-[12.5px] font-semibold text-[#0a0f1e] flex-1">
          {category.title || category.label}
        </span>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            isActive
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isActive ? "Active" : "Pending"}
        </span>
      </div>
      {category.requirements && (
        <div className="flex flex-wrap gap-1">
          {category.requirements.map((req, idx) => (
            <span
              key={idx}
              className={`text-[10.5px] px-1.5 py-0.5 rounded ${
                isActive
                  ? "bg-emerald-100/50 text-emerald-600"
                  : "bg-amber-100/50 text-amber-600"
              }`}
            >
              {req.icon} {req.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddCategoryCard() {
  return (
    <div className="border-2 border-dashed border-blue-200/60 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center">
        <Upload size={14} className="text-[#024CEE]" />
      </div>
      <div className="text-[12px] font-semibold text-[#024CEE]">
        Add Category
      </div>
      <div className="text-[11px] text-gray-500 text-center">
        Request access to a new service category
      </div>
    </div>
  );
}