import React, { useState } from "react";

const QuickQuestions = ({
  role,
  subRole,
  onRoleChange,
  onSubRoleChange,
  onContinue,
}) => {
  const [step, setStep] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const goalOptions = [
    {
      id: "relocate",
      icon: "✈️",
      bg: "#EAF7FC",
      title: "My goal is to travel to Germany for work, or study.",
      desc: "I need a clear roadmap to start my life in Germany. I am looking for help with my Visa, University applications, translating my documents, or getting my certificates recognized. I want to find the right job or training and improve my German language skills to succeed in my new career.",
    },
    {
      id: "service",
      icon: "⚡",
      bg: "#F0FFF4",
      title: "I offer services for people seeking to travel to Germany.",
      desc: "I am an expert or a company providing expertise in areas like Language teaching, Certified translation, Career coaching, Visa consulting, or Relocation support, and I want to showcase my services on this platform.",
    },
  ];

  const serviceOptions = [
    {
      id: "freelancer",
      icon: "🧑‍💻",
      bg: "#EBF1FD",
      title: "Independent Freelancer",
      desc: "I am a self-employed professional providing services directly to clients. Whether I am a tutor, translator, or consultant, I rely on my personal expertise and certifications to deliver high-quality support.",
    },
    {
      id: "company",
      icon: "🏛️",
      bg: "#F0FFF4",
      title: "Registered Company",
      desc: "We are an official business or a licensed organization. We operate as a professional team with a registered trade license to provide various services at a corporate or agency level.",
    },
  ];

  const handleGoalSelect = (option) => {
    setSelectedGoal(option.id);
    if (option.id === "service") {
      setStep(2);
    } else {
      onRoleChange("relocate");
      onSubRoleChange(null);
      setStep(3);
    }
  };

  const handleServiceSelect = (option) => {
    setSelectedService(option.id);
    onRoleChange("provider");
    onSubRoleChange(option.id);
    setStep(3);
  };

  const getResultData = () => {
    if (role === "provider" && subRole === "freelancer") {
      return {
        icon: "🧑‍💻",
        role: "Freelance Service Provider",
        desc: "Create your profile, list your services, and connect with clients seeking expert support for their Germany journey.",
        tags: ["Verified Profile", "Service Listings", "Client Reviews"],
      };
    }
    if (role === "provider" && subRole === "company") {
      return {
        icon: "🏛️",
        role: "Service Provider — Company",
        desc: "Register your organisation, upload your credentials, and connect with clients looking for certified agencies and language schools.",
        tags: ["Company Profile", "Team Management", "Verified Badges"],
      };
    }
    return {
      icon: "✈️",
      role: "Individual Account",
      desc: "Step-by-step guidance for visa applications, language courses, certificate recognition, and everything you need to settle in Germany.",
      tags: ["Visa Help", "Language Course", "Recognition", "Relocation"],
    };
  };

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0">
      {step === 1 && (
        <div key="step1" className="animate-fade-up">
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Let's get you set up 👋
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            Answer a few quick questions and we'll take you to the right signup
            — takes under 30 seconds.
          </div>
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            What's your main goal on Germany Assists?
          </div>
          <div className="flex flex-col gap-2.5 mb-2">
            {goalOptions.map((option, index) => (
              <div
                key={option.id}
                onClick={() => handleGoalSelect(option)}
                className={`flex items-start gap-3.5 p-4 border-2 rounded-2xl cursor-pointer bg-white transition-all ${
                  selectedGoal === option.id
                    ? "border-[#024CEE] bg-[#EBF1FD] shadow-[0_0_0_3px_rgba(2,76,238,0.1)]"
                    : "border-[#E5E7EB] hover:border-[#93b4f7] hover:bg-[#F8FAFF]"
                }`}
                style={{ animationDelay: `${0.35 + index * 0.1}s` }}
              >
                <div
                  className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 mt-0.5 transition-transform ${
                    selectedGoal === option.id ? "scale-108" : ""
                  }`}
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[0.93rem] font-bold text-[#111827] mb-1">
                    {option.title}
                  </div>
                  <p className="text-[0.78rem] text-[#6B7280] leading-relaxed mb-2">
                    {option.desc}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${
                    selectedGoal === option.id
                      ? "border-[#024CEE] bg-[#024CEE] scale-110"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  {selectedGoal === option.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-[7px] h-[7px] rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div key="step2" className="animate-fade-up">
          <button
            onClick={() => {
              setAnimKey((k) => k + 1);
              setStep(1);
              setSelectedGoal(null);
            }}
            className="flex items-center p-3 gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
          >
            ← Back
          </button>
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Almost there! 🎯
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            One more question to personalise your account.
          </div>
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            How do you offer your services?
          </div>
          <div className="flex flex-col gap-2.5">
            {serviceOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleServiceSelect(option)}
                className={`flex items-start gap-3.5 p-4 border-2 pb-6 rounded-2xl cursor-pointer bg-white transition-all ${
                  selectedService === option.id
                    ? "border-[#024CEE] bg-[#EBF1FD] shadow-[0_0_0_3px_rgba(2,76,238,0.1)]"
                    : "border-[#E5E7EB] hover:border-[#93b4f7] hover:bg-[#F8FAFF]"
                }`}
              >
                <div
                  className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 mt-0.5 transition-transform ${
                    selectedService === option.id ? "scale-108" : ""
                  }`}
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-[#111827] mb-1">
                    {option.title}
                  </div>
                  <p className="text-sm text-[#6B7280]">{option.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${
                    selectedService === option.id
                      ? "border-[#024CEE] bg-[#024CEE] scale-110"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  {selectedService === option.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-[7px] h-[7px] rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div key="step3" className="animate-fade-up">
          <button
            onClick={() => {
              if (role === "provider") {
                setStep(2);
                setSelectedService(null);
              } else {
                setStep(1);
                setSelectedGoal(null);
              }
            }}
            className="flex p-3 items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
          >
            ← Back
          </button>
          <div
            className="text-[1.375rem] font-bold text-[#111827] mb-1"
            id="qsResultTitle"
          >
            Perfect match found ✅
          </div>
          <div className="text-sm text-[#6B7280] mb-5" id="qsResultSub">
            Based on your answers, here's the account type we'll create for you:
          </div>
          <div
            className="bg-[#EBF1FD] border-2 border-[#024CEE] rounded-2xl p-5 mb-5 flex items-start gap-4"
            id="qsResultCard"
          >
            <div className="text-[32px] flex-shrink-0" id="qsResultIcon">
              {getResultData().icon}
            </div>
            <div>
              <div
                className="text-[0.95rem] font-bold text-[#111827] mb-1"
                id="qsResultRole"
              >
                {getResultData().role}
              </div>
              <p
                className="text-[0.8rem] text-[#6B7280] leading-relaxed mb-3"
                id="qsResultDesc"
              >
                {getResultData().desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {getResultData().tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-white border border-blue-200 text-[#024CEE]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onContinue}
            className="w-full py-3.5 rounded-xl bg-[#024CEE] text-white font-bold text-sm transition-all hover:bg-[#0341cc] active:scale-[0.99] shadow-[0_2px_10px_rgba(2,76,238,0.18)] hover:shadow-[0_4px_18px_rgba(2,76,238,0.28)]"
          >
            Yes, create my account →
          </button>
          <button
            onClick={() => {
              setStep(1);
              setSelectedGoal(null);
              setSelectedService(null);
            }}
            className="w-full py-2.75 mt-2 p-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
          >
            ← That's not me, start over
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickQuestions;
