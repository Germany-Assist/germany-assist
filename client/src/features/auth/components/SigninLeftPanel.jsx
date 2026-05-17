import React from "react";
import { Link } from "react-router-dom";

const SigninLeftPanel = () => {
  return (
    <div className="w-[280px] flex-shrink-0 bg-[#F9FAFB] border-r border-[#E5E7EB] px-6 py-9 flex flex-col">
      <div className="text-[1.05rem] font-bold text-[#111827] mb-1">
        Welcome back
      </div>
      <div className="text-[0.79rem] text-[#6B7280] leading-relaxed mb-6">
        Your trusted, verified gateway to opportunities in Germany.
      </div>

      <div className="flex flex-col">
        <div className="flex items-start gap-2.5 pb-5 relative">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold border border-[#024CEE] bg-[#EBF1FD] text-[#024CEE] relative z-10">
            1
          </div>
          <div className="relative z-0 pl-2">
            <div className="text-[0.78rem] font-semibold text-[#111827]">Enter your credentials</div>
            <div className="text-[0.69rem] text-[#9CA3AF]">Sign in with email or social</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 pb-5 relative">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold border border-[#E5E7EB] bg-white text-[#6B7280] relative z-10">
            2
          </div>
          <div className="relative z-0 pl-2">
            <div className="text-[0.78rem] font-semibold text-[#6B7280]">Access your dashboard</div>
            <div className="text-[0.69rem] text-[#9CA3AF]">Manage your profile and services</div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 relative">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold border border-[#E5E7EB] bg-white text-[#6B7280] relative z-10">
            3
          </div>
          <div className="relative z-0 pl-2">
            <div className="text-[0.78rem] font-semibold text-[#6B7280]">Connect with providers</div>
            <div className="text-[0.69rem] text-[#9CA3AF]">Find services and opportunities</div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[0.75rem] text-[#6B7280]">
          <div className="w-[22px] h-[22px] rounded-md bg-[#EBF1FD] flex items-center justify-center text-[11px]">🔒</div>
          Escrow-protected transactions
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] text-[#6B7280]">
          <div className="w-[22px] h-[22px] rounded-md bg-[#EBF1FD] flex items-center justify-center text-[11px]">✅</div>
          Verified providers only
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] text-[#6B7280]">
          <div className="w-[22px] h-[22px] rounded-md bg-[#EBF1FD] flex items-center justify-center text-[11px]">🆓</div>
          Free individual registration
        </div>
      </div>
    </div>
  );
};

export default SigninLeftPanel;