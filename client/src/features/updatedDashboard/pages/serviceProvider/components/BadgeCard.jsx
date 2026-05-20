import React from "react";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function BadgeCard({ badge }) {
  const isEarned = badge.status === "earned";
  const isLocked = badge.status === "locked";

  return (
    <div
      className={`border rounded-lg p-3.5 transition-all relative ${
        isEarned
          ? "border-emerald-200 bg-emerald-50/5"
          : "border-[#e0e7ff] bg-transparent"
      } ${isLocked ? "opacity-60" : ""}`}
    >
      {isEarned && (
        <div className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full bg-emerald-600 flex items-center justify-center"></div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
          {badge.icon}
        </div>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            isEarned
              ? "bg-emerald-100 text-emerald-600"
              : isLocked
                ? "bg-gray-200 text-gray-500"
                : "bg-blue-50 text-blue-600"
          }`}
        >
          {isEarned ? "Earned" : isLocked ? "Locked" : "Upload"}
        </span>
      </div>
      <div className="text-[12px] font-semibold text-[#0a0f1e] mb-0.5">
        {badge.name}
      </div>
      <div className="text-[11px] text-gray-500 leading-relaxed">
        {badge.desc}
      </div>
      {!isEarned && !isLocked && (
        <div className="text-[11px] font-semibold text-[#024CEE] cursor-pointer mt-1.5 inline-flex items-center gap-0.5 hover:underline">
          Upload <ExternalLink size={11} />
        </div>
      )}
    </div>
  );
}
