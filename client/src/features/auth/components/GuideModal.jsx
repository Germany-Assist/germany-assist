import React, { useEffect } from "react";

const GuideModal = ({ isOpen, onClose, data }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const { icon, title, desc, benefits } = data;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar (Optional style touch) */}
        <div className="h-2 bg-blue-600" />

        <div className="p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-4xl">
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">{desc}</p>
          </div>

          {/* Benefits List */}
          <ul className="mb-8 space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 text-xl">{benefit.icon}</span>
                <span className="text-sm leading-snug text-slate-700">
                  {benefit.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              Got it — Let's go!
            </button>

            <button
              onClick={() => alert("Full guide coming soon!")}
              className="group flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              <span>📄</span>
              <span className="group-hover:underline">View Full Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
