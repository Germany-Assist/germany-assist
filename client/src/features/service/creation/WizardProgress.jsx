import React from "react";

const WizardProgress = ({ currentStep }) => {
  const steps = ["Basics", "Pricing", "Media", "Status"];
  return (
    <nav className="relative py-6 transition-colors duration-700">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-6 bg-zinc-100/50 p-2 px-6 rounded-full border border-zinc-200/50 backdrop-blur-md">
          {steps.map((label, i) => {
            const stepNum = i + 1;
            const isActive = currentStep >= stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-3 group">
                  {/* Step Number Circle */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 scale-90 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-100"
                        : "bg-zinc-200 text-zinc-500"
                    } ${isCurrent ? "ring-4 ring-indigo-500/20" : ""}`}
                  >
                    {stepNum}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                      isActive ? "text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector Line */}
                {stepNum < steps.length && (
                  <div className="mx-6 w-12 h-[2px] rounded-full overflow-hidden bg-zinc-200">
                    <div
                      className={`h-full bg-indigo-500 transition-all duration-700 ease-in-out ${
                        currentStep > stepNum ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default WizardProgress;
