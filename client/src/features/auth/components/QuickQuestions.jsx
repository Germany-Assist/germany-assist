import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuickQuestions = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ goal: null, type: null });

  const goalOptions = [
    {
      value: "relocate",
      icon: "✈️",
      bg: "#EAF7FC",
      title: "My goal is to travel to Germany for work, or study.",
      desc: "I need a clear roadmap to start my life in Germany. I am looking for help with my Visa, University applications, translating my documents, or getting my certificates recognized. I want to find the right job or training and improve my German language skills to succeed in my new career.",
    },
    {
      value: "service",
      icon: "⚡",
      bg: "#F0FFF4",
      title: "I offer services for people seeking to travel to Germany.",
      desc: "I am an expert or a company providing expertise in areas like Language teaching, Certified translation, Career coaching, Visa consulting, or Relocation support, and I want to showcase my services on this platform.",
    },
  ];

  const typeOptions = [
    {
      value: "freelancer",
      icon: "🧑‍💻",
      bg: "#EBF1FD",
      title: "Independent Freelancer",
      desc: "I am a self-employed professional providing services directly to clients. Whether I am a tutor, translator, or consultant, I rely on my personal expertise and certifications to deliver high-quality support.",
    },
    {
      value: "company",
      icon: "🏛️",
      bg: "#F0FFF4",
      title: "Registered Company",
      desc: "We are an official business or a licensed organization. We operate as a professional team with a registered trade license to provide various services at a corporate or agency level.",
    },
  ];

  const getResultData = () => {
    if (selection.goal === "relocate") {
      return {
        icon: "✈️",
        role: "Individual",
        title: "Individual Account",
        roleDesc:
          "Step-by-step guidance for visa applications, language courses, certificate recognition, and everything you need to settle in Germany.",
        tags: ["Visa Help", "Language Course", "Recognition", "Relocation"],
      };
    } else if (selection.type === "freelancer") {
      return {
        icon: "🧑‍💻",
        role: "Service Provider - Freelancer",
        roleDesc:
          "Earn verified professional badges, reach thousands of motivated candidates, and grow your solo practice on the platform.",
        tags: ["Career Coach", "Translator", "Consultant", "Teacher"],
      };
    } else if (selection.type === "company") {
      return {
        icon: "🏛️",
        role: "Service Provider - Company",
        roleDesc:
          "Register your organisation, upload your credentials, and connect with clients looking for certified agencies and language schools.",
        tags: ["Language School", "Agency", "Recruitment", "Organisation"],
      };
    }
    return null;
  };

  const handleGoalSelect = (value) => {
    setSelection({ ...selection, goal: value });
    if (value === "relocate") {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleTypeSelect = (value) => {
    setSelection({ ...selection, type: value });
    setStep(3);
  };

  const handleConfirm = () => {
    if (selection.goal === "relocate") {
      navigate("/signup/individual");
    } else if (selection.type === "freelancer") {
      navigate("/signup/provider?subRole=freelancer");
    } else if (selection.type === "company") {
      navigate("/signup/provider?subRole=company");
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelection({ ...selection, goal: null });
    } else if (step === 3) {
      if (selection.goal === "relocate") {
        setStep(1);
        setSelection({ goal: null, type: null });
      } else {
        setStep(2);
        setSelection({ ...selection, type: null });
      }
    }
  };

  const resultData = step === 3 ? getResultData() : null;

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0 animate-fade-up">
      {step === 1 && (
        <div className="animate-fade-up">
          <div className="text-[1.35rem] font-bold text-[#111827] mb-1">
            Let's get you set up 👋
          </div>
          <div className="text-[0.83rem] text-[#6B7280] mb-5 leading-relaxed">
            Answer a few quick questions and we'll take you to the right signup
            — takes under 30 seconds.
          </div>
          <div className="text-[0.72rem] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            What's your main goal on Germany Assists?
          </div>
          <div className="flex flex-col gap-[10px]">
            {goalOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleGoalSelect(option.value)}
                className="flex items-start gap-3.5 p-[18px] border-2 border-[#E5E7EB] rounded-[16px] cursor-pointer bg-white hover:border-[#93b4f7] hover:bg-[#F8FAFF] transition-all"
                style={{ boxShadow: "0 2px 12px rgba(2,76,238,0.06)" }}
              >
                <div
                  className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[0.93rem] font-bold text-[#111827] mb-1">
                    {option.title}
                  </div>
                  <p className="text-[0.78rem] text-[#6B7280] leading-relaxed">
                    {option.desc}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-up">
          <button
            onClick={handleBack}
            className="flex p-3 items-center gap-1.5 bg-none border border-[#E5E7EB] text-[#6B7280] text-[0.79rem] py-1.5 px-2.75 rounded-lg cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4"
          >
            ← Back
          </button>
          <div className="text-[1.35rem] font-bold text-[#111827] mb-1">
            Almost there! 🎯
          </div>
          <div className="text-[0.83rem] text-[#6B7280] mb-5 leading-relaxed">
            One more question to personalise your account.
          </div>
          <div className="text-[0.72rem] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            How do you offer your services?
          </div>
          <div className="flex flex-col gap-[10px]">
            {typeOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleTypeSelect(option.value)}
                className="flex items-start gap-3.5 p-[18px] border-2 border-[#E5E7EB] rounded-[16px] cursor-pointer bg-white hover:border-[#93b4f7] hover:bg-[#F8FAFF] transition-all"
                style={{ boxShadow: "0 2px 12px rgba(2,76,238,0.06)" }}
              >
                <div
                  className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[0.93rem] font-bold text-[#111827] mb-1">
                    {option.title}
                  </div>
                  <p className="text-[0.78rem] text-[#6B7280] leading-relaxed">
                    {option.desc}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && resultData && (
        <div className="animate-fade-up">
          <button
            onClick={handleBack}
            className="flex p-3 items-center gap-1.5 bg-none border border-[#E5E7EB] text-[#6B7280] text-[0.79rem] py-1.5 px-2.75 rounded-lg cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4"
          >
            ← Back
          </button>
          <div className="text-[1.35rem] font-bold text-[#111827] mb-1">
            Perfect match found ✅
          </div>
          <div className="text-[0.83rem] text-[#6B7280] mb-5 leading-relaxed">
            Based on your answers, here's the account type we'll create for you:
          </div>
          <div
            className="bg-[#EBF1FD] border-2 border-[#024CEE] rounded-[16px] p-[22px] mb-5 flex items-start gap-3.5"
            style={{
              boxShadow:
                "0 0 0 3px rgba(2,76,238,0.1), 0 4px 16px rgba(2,76,238,0.1)",
            }}
          >
            <div className="text-[32px] flex-shrink-0">{resultData.icon}</div>
            <div>
              <div className="text-[0.95rem] font-bold text-[#111827] mb-1">
                {resultData.role}
              </div>
              <div className="text-[0.8rem] text-[#6B7280] leading-relaxed">
                {resultData.roleDesc}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {resultData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.67rem] px-2 py-0.5 rounded-full bg-white border border-[#a7bae4] text-[#024CEE]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-[10px] bg-[#024CEE] text-white font-semibold text-[0.9rem] cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 10px rgba(2,76,238,0.18)" }}
          >
            Yes, create my account →
          </button>
          <button
            onClick={handleBack}
            className="w-full py-[11px] border border-[#E5E7EB] rounded-[10px] bg-white text-[#6B7280] text-[0.9rem] font-medium cursor-pointer transition-all mt-2 hover:border-[#93b4f7] hover:text-[#111827]"
          >
            ← That's not me, start over
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickQuestions;
