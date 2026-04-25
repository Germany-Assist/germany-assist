import React from "react";

const TermsCheckbox = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-start gap-2.5 mt-3 p-3 rounded-xl border-2 border-[#E5E7EB] cursor-pointer transition-all mb-3.5 hover:border-[#93b4f7]"
    >
      <span
        className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center text-[9px] ${
          checked
            ? "bg-[#024CEE] border-[#024CEE] text-white"
            : "border-[#E5E7EB] bg-white"
        }`}
      >
        {checked && "✓"}
      </span>
      <div className="text-sm text-[#6B7280]">
        I agree to the <span className="text-[#024CEE] font-medium">Terms</span>{" "}
        and <span className="text-[#024CEE] font-medium">Privacy Policy</span>.
      </div>
    </div>
  );
};

export default TermsCheckbox;
