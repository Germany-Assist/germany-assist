import React, { useState } from "react";
import GuideModal from "./GuideModal";

const RoleSelection = ({
  role,
  subRole,
  onRoleChange,
  onSubRoleChange,
  onContinue,
}) => {
  const [guideModalState, setGuideModalState] = useState({
    isOpen: false,
    data: null,
  });

  const actors = [
    {
      id: "individual",
      icon: "🎯",
      bg: "#EBF1FD",
      title: "Individual",
      desc: "Job seekers, students, scholarship applicants, and anyone planning to relocate to Germany. Access verified job listings, scholarships, language courses, visa services, and full relocation guidance — completely free.",
      tags: [
        "Job Seeker",
        "Student",
        "Scholarship",
        "Relocation",
        "Chance Card",
      ],
    },
    {
      id: "provider",
      icon: "⚡",
      bg: "#F0FFF4",
      title: "Service Provider",
      desc: "Language schools, career coaches, translators, visa consultants, certificate recognition experts, and relocation specialists. Earn verified professional badges and reach thousands of motivated international candidates.",
      tags: [
        "Language School",
        "Career Coach",
        "Translator",
        "Visa Consultant",
        "Recruiter",
      ],
      hasSubOptions: true,
    },
  ];

  const GUIDES = {
    individual: {
      icon: "🎯",
      title: "Individual Account",
      desc: "For job seekers, students, scholarship applicants, and anyone relocating to Germany. Get free, full access to all platform opportunities.",
      benefits: [
        { icon: "🆓", text: "Free registration — zero fees to join" },
        {
          icon: "🔍",
          text: "Browse verified jobs, scholarships, and university programs",
        },
        {
          icon: "🔒",
          text: "All transactions escrow-protected — pay only when satisfied",
        },
        {
          icon: "📋",
          text: "Step-by-step relocation guidance from application to arrival",
        },
        {
          icon: "🌍",
          text: "Connect with certified providers for visa, language, recognition & more",
        },
        { icon: "📈", text: "Track your progress on your personal dashboard" },
      ],
    },
    provider: {
      icon: "⚡",
      title: "Service Provider Guide",
      desc: "For language schools, coaches, translators, visa consultants, relocation specialists, and recruiters. Reach thousands of verified candidates.",
      benefits: [
        {
          icon: "🏅",
          text: "Earn verified badges: Certified Teacher, Sworn Translator, Licensed Agency...",
        },
        {
          icon: "🌐",
          text: "Market access across Germany and Arab-speaking countries",
        },
        {
          icon: "💼",
          text: "20% transaction fee only when you earn — no upfront costs",
        },
        {
          icon: "📢",
          text: "Premium visibility features to stand out in search",
        },
        {
          icon: "🤝",
          text: "Direct, platform-mediated connections with verified clients",
        },
        {
          icon: "📊",
          text: "Performance analytics and dedicated provider support",
        },
      ],
    },
  };

  const subOptions = [
    {
      id: "freelancer",
      icon: "🧑‍💻",
      title: "Freelancer",
      desc: "I work independently as an individual professional — solo consultant, teacher, or coach.",
    },
    {
      id: "office",
      icon: "🏛️",
      title: "Office / Organization",
      desc: "I represent a registered company, language school, agency, or organization with staff.",
    },
  ];

  const canContinue = () => {
    if (!role) return false;
    if (role === "provider" && !subRole) return false;
    return true;
  };

  return (
    <div className="w-full max-w-[560px] text-left">
      <GuideModal
        isOpen={guideModalState.isOpen}
        data={guideModalState.data}
        onClose={() => setGuideModalState({ isOpen: false, data: null })}
      />

      <div className="text-xl font-bold text-[#111827] mb-1">
        Welcome! Who are you?
      </div>
      <div className="text-sm text-[#6B7280] mb-6">
        Choose your role to get started. You'll be able to sign in with Google,
        Apple, or Facebook after selecting.
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {actors.map((actor) => {
          const isSelected = role === actor.id;

          return (
            <div
              key={actor.id}
              onClick={() => {
                onRoleChange(actor.id);
                if (actor.id !== "provider") onSubRoleChange(null);
              }}
              className={`flex flex-col border-2 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "border-[#024CEE] bg-[#F8FAFF] shadow-sm"
                  : "border-[#E5E7EB] bg-white hover:border-[#93b4f7]"
              }`}
            >
              {/* Main Card */}
              <div className="flex items-start gap-4 p-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5 transition-transform duration-300"
                  style={{
                    backgroundColor: actor.bg,
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {actor.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-[#111827]">
                      {actor.title}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#024CEE] bg-[#024CEE]" : "border-[#E5E7EB]"}`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
                    {actor.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {actor.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full border ${isSelected ? "bg-white border-blue-200 text-[#024CEE]" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuideModalState({
                        isOpen: true,
                        data: GUIDES[actor.id],
                      });
                    }}
                    className="text-sm font-semibold text-[#024CEE] hover:underline flex items-center gap-1.5"
                  >
                    📄 Read full guide
                  </button>
                </div>
              </div>

              {/* Expandable Sub-Options Section */}
              {actor.hasSubOptions && (
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isSelected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <div className="pt-4 border-t border-blue-100 mt-2">
                        <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-3">
                          How do you work?
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {subOptions.map((sub) => (
                            <div
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSubRoleChange(sub.id);
                              }}
                              className={`p-4 rounded-xl border-2 transition-all relative ${
                                subRole === sub.id
                                  ? "border-[#024CEE] bg-white shadow-sm"
                                  : "border-[#E5E7EB] bg-white hover:border-blue-200"
                              }`}
                            >
                              <div
                                className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-[#024CEE] text-white text-[10px] flex items-center justify-center transition-all ${subRole === sub.id ? "scale-100" : "scale-0"}`}
                              >
                                ✓
                              </div>
                              <div className="text-2xl mb-2">{sub.icon}</div>
                              <div className="text-sm font-bold text-[#111827] mb-1">
                                {sub.title}
                              </div>
                              <p className="text-xs text-[#6B7280] leading-snug">
                                {sub.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onContinue}
        disabled={!canContinue()}
        className="w-full py-3.5 rounded-xl bg-[#024CEE] text-white font-bold text-sm transition-all hover:bg-[#0341cc] disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        Continue →
      </button>
    </div>
  );
};

export default RoleSelection;
