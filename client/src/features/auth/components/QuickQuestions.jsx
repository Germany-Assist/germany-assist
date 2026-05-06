import React, { useState } from "react";

const QuickQuestions = ({ role, subRole, onRoleChange, onSubRoleChange, onContinue }) => {
  const [step, setStep] = useState(1);

  const goalOptions = [
    {
      id: "work",
      icon: "💼",
      bg: "#EBF1FD",
      title: "Find work or study in Germany",
      desc: "I'm looking for jobs, Ausbildung, scholarships, or university programmes.",
    },
    {
      id: "relocate",
      icon: "✈️",
      bg: "#EAF7FC",
      title: "Plan my move to Germany",
      desc: "I need help with visa, language courses, certificate recognition, or relocation.",
    },
    {
      id: "service",
      icon: "⚡",
      bg: "#F0FFF4",
      title: "Offer services to people moving to Germany",
      desc: "I'm a coach, translator, language school, visa consultant, or relocation specialist.",
    },
  ];

  const serviceOptions = [
    {
      id: "freelancer",
      icon: "🧑‍💻",
      bg: "#EBF1FD",
      title: "Independently / Freelance",
      desc: "I work solo — as an individual coach, consultant, teacher, or specialist.",
    },
    {
      id: "company",
      icon: "🏛️",
      bg: "#F0FFF4",
      title: "As a company or organisation",
      desc: "I represent a registered company, language school, agency, or organisation with staff.",
    },
  ];

  const resultData = {
    individual: {
      icon: "🎯",
      role: "Individual Account",
      desc: "Get free access to verified jobs, scholarships, language courses, and full relocation guidance.",
      tags: ["Job Seeker", "Student", "Scholarship", "Relocation"],
    },
    provider: {
      freelancer: {
        icon: "🧑‍💻",
        role: "Freelance Service Provider",
        desc: "Offer your services independently — coaching, translation, visa consulting, and more.",
        tags: ["Individual", "Verified Badges", "20% Fee on Earnings"],
      },
      company: {
        icon: "🏛️",
        role: "Company Service Provider",
        desc: "Represent a registered company, language school, agency, or organisation.",
        tags: ["Organization", "Verified Badges", "20% Fee on Earnings"],
      },
    },
    relocate: {
      icon: "✈️",
      role: "Individual Account",
      desc: "Get help with visa, language courses, certificate recognition, and full relocation support.",
      tags: ["Relocation", "Visa Help", "Language Courses"],
    },
  };

  const handleGoalSelect = (goalId) => {
    if (goalId === "service") {
      setStep(2);
    } else {
      onRoleChange(goalId === "work" ? "individual" : "relocate");
      onSubRoleChange(null);
      setStep(3);
    }
  };

  const handleServiceSelect = (serviceId) => {
    onRoleChange("provider");
    onSubRoleChange(serviceId);
    setStep(3);
  };

  const getResultData = () => {
    if (role === "provider" && subRole) {
      return resultData.provider[subRole];
    }
    if (role === "relocate") {
      return resultData.relocate;
    }
    return resultData.individual;
  };

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0">
      {step === 1 && (
        <div className="fade-in">
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Let's get you set up 👋
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            Answer a few quick questions and we'll take you to the right signup — takes under 30 seconds.
          </div>
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            What's your main goal on Germany Assists?
          </div>
          <div className="flex flex-col gap-3">
            {goalOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleGoalSelect(option.id)}
                className="flex items-start gap-4 p-4 border-2 border-[#E5E7EB] rounded-2xl cursor-pointer bg-white hover:border-[#93b4f7] transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-[#111827] mb-1">{option.title}</div>
                  <p className="text-sm text-[#6B7280]">{option.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
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
          <div className="flex flex-col gap-3">
            {serviceOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleServiceSelect(option.id)}
                className="flex items-start gap-4 p-4 border-2 border-[#E5E7EB] rounded-2xl cursor-pointer bg-white hover:border-[#93b4f7] transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: option.bg }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-[#111827] mb-1">{option.title}</div>
                  <p className="text-sm text-[#6B7280]">{option.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in">
          <button
            onClick={() => {
              if (role === "provider") {
                setStep(2);
              } else {
                setStep(1);
              }
            }}
            className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
          >
            ← Back
          </button>
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Ready to create your account
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            You've selected the right path for your goals.
          </div>
          <div
            className="bg-[#EBF1FD] border-2 border-[#024CEE] rounded-2xl p-5 mb-5 flex items-start gap-4"
          >
            <div className="text-3xl flex-shrink-0">{getResultData().icon}</div>
            <div>
              <div className="text-base font-bold text-[#111827] mb-1">{getResultData().role}</div>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{getResultData().desc}</p>
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
            className="w-full py-3.5 rounded-xl bg-[#024CEE] text-white font-bold text-sm transition-all hover:bg-[#0341cc] active:scale-[0.99]"
          >
            Yes, create my account →
          </button>
          <button
            onClick={() => setStep(1)}
            className="w-full py-2.75 mt-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
          >
            ← That's not me, start over
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickQuestions;