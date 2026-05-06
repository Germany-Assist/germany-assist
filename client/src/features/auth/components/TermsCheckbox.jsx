import React from "react";

const TermsCheckbox = ({ checked, onChange, error }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-2.5 mt-3 p-3 rounded-xl border-2 cursor-pointer transition-all mb-3.5 hover:border-[#93b4f7] ${
        error ? "border-red-500 bg-red-50" : "border-[#E5E7EB]"
      }`}
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
        I agree to{" "}
        <span className="text-[#024CEE] font-medium">Terms of Service</span> and{" "}
        the and{" "}
        <span className="text-[#024CEE] font-medium">Privacy Policy</span>,
        including the Internal Communication Only policy and escrow transaction
        rules.
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default TermsCheckbox;
