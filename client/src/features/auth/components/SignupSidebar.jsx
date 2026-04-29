import React from "react";

const SignupSidebar = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Choose Your Role", subLabel: "Individual or Provider" },
    { num: 2, label: "Basic Info", subLabel: "Name, email & password" },
    { num: 3, label: "Verification", subLabel: "Confirm your email" },
  ];

  return (
    <div className="flex flex-col text-left h-full w-full  ">
      <div className="text-base font-bold text-[#111827] mb-1.5 ">
        Create your account
      </div>
      <div className="text-sm text-[#6B7280] leading-relaxed mb-6 pb-6">
        Your trusted, verified gateway to opportunities in Germany.
      </div>

      <div className="flex flex-col flex-1">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-start gap-3 pb-8 relative">
            {/* Step Connector Line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-[11px] top-7 w-0.5 h-full ${
                  step.num < currentStep ? "bg-[#49B7DF]" : "bg-[#E5E7EB]"
                }`}
              ></div>
            )}

            {/* Step Number/Icon */}
            <div
              className={`w-[24px] h-[24px] rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold relative z-10 border-2 transition-all ${
                step.num < currentStep
                  ? "bg-[#EAF7FC] border-[#49B7DF] text-[#49B7DF]"
                  : step.num === currentStep
                    ? "bg-[#024CEE] border-[#024CEE] text-white"
                    : "bg-white border-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              {step.num < currentStep ? "✓" : step.num}
            </div>

            {/* Step Text */}
            <div className="flex flex-col">
              <div
                className={`text-sm font-semibold transition-colors ${
                  step.num === currentStep ? "text-[#111827]" : "text-[#6B7280]"
                }`}
              >
                {step.label}
              </div>
              <div className="text-xs text-[#9CA3AF] mt-0.5">
                {step.subLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges - mt-auto pushes this to the bottom */}
      <div className="mt-auto pt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
          <span className="w-6 h-6 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            🔒
          </span>
          <span className="leading-tight">Escrow-protected transactions</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
          <span className="w-6 h-6 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            ✅
          </span>
          <span className="leading-tight">Verified providers only</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
          <span className="w-6 h-6 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            🆓
          </span>
          <span className="leading-tight">Free individual registration</span>
        </div>
      </div>
    </div>
  );
};

export default SignupSidebar;
