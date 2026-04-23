import React from "react";

const SignupSidebar = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Choose Your Role", subLabel: "Individual or Provider" },
    { num: 2, label: "Basic Info", subLabel: "Name, email & password" },
    { num: 3, label: "Additional Info", subLabel: "Location & documents" },
    { num: 4, label: "Verification", subLabel: "Confirm your email" },
  ];

  return (
    <div className="w-[280px] flex-shrink-0 bg-[#F9FAFB] border-r border-[#E5E7EB] px-6 py-9 flex flex-col text-left">
      <div className="text-base font-bold text-[#111827] mb-1.5 ">
        Create your account
      </div>
      <div className=" text-sm text-[#6B7280] leading-relaxed mb-6.5 pb-6">
        Your trusted, verified gateway to opportunities in Germany.
      </div>

      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`flex items-start gap-2.5 pb-5 relative ${step.num < currentStep ? "done" : ""}`}
          >
            {i < steps.length - 1 && (
              <div
                className={`absolute left-[11px] top-6 w-0.5 h-full ${step.num < currentStep ? "bg-[#49B7DF] opacity-50" : "bg-[#E5E7EB]"}`}
              ></div>
            )}
            <div
              className={`w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold relative z-10 border-2 transition-all ${
                step.num < currentStep
                  ? "bg-[#EAF7FC] border-[#49B7DF] text-[#49B7DF]"
                  : step.num === currentStep
                    ? "bg-[#024CEE] border-[#024CEE] text-white"
                    : "bg-white border-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              {step.num < currentStep ? "✓" : step.num}
            </div>
            <div>
              <div
                className={`text-sm font-semibold ${step.num === currentStep ? "text-[#111827]" : "text-[#6B7280]"}`}
              >
                {step.label}
              </div>
              <div className="text-xs text-[#9CA3AF] mt-0.25">
                {step.subLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-5.5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="w-5.5 h-5.5 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            🔒
          </span>
          Escrow-protected transactions
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="w-5.5 h-5.5 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            ✅
          </span>
          Verified providers only
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="w-5.5 h-5.5 rounded-md bg-[#EBF1FD] flex items-center justify-center text-xs">
            🆓
          </span>
          Free individual registration
        </div>
      </div>
    </div>
  );
};

export default SignupSidebar;
