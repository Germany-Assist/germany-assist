import React from "react";

const SkipPage = ({
  onBack,
  onAddDetails,
  onSkip,
  isSubmitting = false,
  error = "",
}) => {
  return (
    <div className="w-full max-w-[560px] text-left px-4  sm:px-0">
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-3.5 animate-shake">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={onBack}
        className="flex p-3 items-center gap-1.5 p-3 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        ← Back
      </button>

      <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
        Almost there! 🎉
      </div>
      <div className="text-sm text-[#6B7280] mb-5">
        Your basic account is ready. Would you like to add location and
        documents now?
      </div>

      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 mb-5 text-center">
        <div className="text-3xl mb-2.5">📋</div>
        <h3 className="text-base font-semibold text-[#111827] mb-1">
          Add Profile Details
        </h3>
        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
          Adding your location and documents helps verify your account faster
          and unlocks all features. It only takes 2 minutes.
        </p>
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center gap-2 p-4 mb-4 bg-blue-50 rounded-lg border border-blue-500">
            {/* Loader Circle */}
            <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />

            {/* Text */}
            <span className="font-medium text-blue-600 text-sm">
              Processing your request...
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={onAddDetails}
            disabled={isSubmitting}
            className="w-full p-3 py-2.75 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Yes, add details →"}
          </button>
          <button
            onClick={onSkip}
            disabled={isSubmitting}
            className="w-full p-3 py-2.75 bg-white rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Skip for now — verify my email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipPage;
