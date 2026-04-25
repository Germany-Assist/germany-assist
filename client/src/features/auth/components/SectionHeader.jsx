import React from "react";

const SectionHeader = ({ icon, title, subtitle, required = false }) => {
  return (
    <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3 flex items-center gap-1.5">
      {icon} {title}
      {required && <span className="text-red-600">* Required</span>}
      {subtitle && (
        <span className="font-normal text-[#9CA3AF] text-[10px] uppercase ml-1">
          — {subtitle}
        </span>
      )}
    </div>
  );
};

export default SectionHeader;