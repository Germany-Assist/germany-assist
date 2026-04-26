import React from "react";
import { Link } from "react-router-dom";

const SigninLeftPanel = () => {
  const features = [
    {
      icon: "🎓",
      title: "German Language Courses",
      desc: "A1 to C2 classes with certified providers near you",
      tag: "Popular",
    },
    {
      icon: "🛂",
      title: "Visa & Residency Consulting",
      desc: "Expert guidance through every step of your application",
      tag: "",
    },
    {
      icon: "💼",
      title: "Job Search Support",
      desc: "CV reviews, interview prep, and employer connections",
      tag: "",
    },
    {
      icon: "🏠",
      title: "Housing & Integration",
      desc: "Find accommodation and settle into your new community",
      tag: "",
    },
    {
      icon: "📋",
      title: "Document & Registration Help",
      desc: "Anmeldung, health insurance, bank accounts and more",
      tag: "",
    },
  ];

  return (
    <div className="w-[480px] text-left flex-shrink-0 bg-gradient-to-b from-[#EBF4FF] via-[#C7E8FF] to-[#E0F3FF] px-11 py-10 flex flex-col relative overflow-hidden border-r border-[#B8DEFF]">
      <div className="inline-flex items-center gap-1.5  bg-white border border-[#B8DEFF] rounded-full px-3 py-1 text-xs font-semibold text-[#024CEE] tracking-wider mb-4 w-fit shadow-[0_2px_8px_rgba(2,76,238,0.08)]">
        <span className="relative flex items-center justify-center w-2 h-2">
          {/* The Ring: Starts small and expands to 2.5x the size */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#024CEE] animate-pulse-ring"></span>

          {/* The Static Center Dot */}
          <span className="relative inline-flex rounded-full w-2 h-2 bg-[#024CEE]"></span>
        </span>
        Everything in one place
      </div>

      <h1 className="text-2xl font-extrabold text-[#0a1a3a] tracking-tight leading-tight mb-2">
        Everything you need
        <br />
        <span className="text-[#024CEE]">to thrive in Germany</span>
      </h1>
      <p className="text-sm text-[#4a6080] leading-relaxed mb-5">
        From visa consulting to language courses — Germany Assists connects you
        with the right services at the right time.
      </p>

      <div className="flex flex-col gap-1.5 flex-1">
        {features.map((feat, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white border border-[#C8E8FF] rounded-xl cursor-default shadow-[0_2px_8px_rgba(2,76,238,0.05)]"
            style={{ animationDelay: `${0.35 + i * 0.1}s` }}
          >
            <div className="text-2xl w-11 h-11 bg-gradient-to-br from-[#EBF4FF] to-[#C7E8FF] border border-[#B8DEFF] rounded-xl flex items-center justify-center flex-shrink-0">
              {feat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[#0a1a3a] truncate">
                {feat.title}
              </div>
              <div className="text-xs text-[#5a7a9a] leading-relaxed">
                {feat.desc}
              </div>
            </div>
            {feat.tag && (
              <span className="text-xs font-bold px-2 py-0.75 rounded-full bg-[#EBF4FF] border border-[#7BBFFF] text-[#024CEE] tracking-wider whitespace-nowrap flex-shrink-0">
                {feat.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SigninLeftPanel;
