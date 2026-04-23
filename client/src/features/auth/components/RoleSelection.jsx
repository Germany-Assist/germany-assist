import React, { useState } from "react";

const RoleSelection = ({ role, subRole, onRoleChange, onSubRoleChange, onContinue }) => {
  const actors = [
    { id: "individual", icon: "🎯", bg: "#EBF1FD", title: "Individual", desc: "Job seekers, students, scholarship applicants, and anyone planning to relocate to Germany. Access verified job listings, scholarships, language courses, visa services, and full relocation guidance — completely free.", tags: ["Job Seeker", "Student", "Scholarship", "Relocation", "Chance Card"] },
    { id: "provider", icon: "⚡", bg: "#F0FFF4", title: "Service Provider", desc: "Language schools, career coaches, translators, visa consultants, certificate recognition experts, and relocation specialists. Earn verified professional badges and reach thousands of motivated international candidates.", tags: ["Language School", "Career Coach", "Translator", "Visa Consultant", "Recruiter"] },
  ];

  const subOptions = [
    { id: "freelancer", icon: "🧑‍💻", title: "Freelancer", desc: "I work independently as an individual professional — solo consultant, teacher, or coach." },
    { id: "office", icon: "🏛️", title: "Office / Organization", desc: "I represent a registered company, language school, agency, or organization with staff." },
  ];

  const canContinue = () => {
    if (!role) return false;
    if (role === "provider" && !subRole) return false;
    return true;
  };

  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xl font-bold text-[#111827] mb-1">Welcome! Who are you?</div>
      <div className="text-sm text-[#6B7280] mb-5.5">Choose your role to get started.</div>

      <div className="flex flex-col gap-2.5 mb-4.5">
        {actors.map((actor) => (
          <div key={actor.id} onClick={() => { onRoleChange(actor.id); onSubRoleChange(null); }} className={`flex items-start gap-3.5 p-4 border-2 rounded-2xl cursor-pointer transition-all ${role === actor.id ? "border-[#024CEE] bg-[#EBF1FD] shadow-[0_0_0_3px_rgba(2,76,238,0.1),0_4px_16px_rgba(2,76,238,0.1)]" : "border-[#E5E7EB] bg-white hover:border-[#93b4f7] hover:bg-[#F8FAFF]"}`}>
            <div className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5 ${role === actor.id ? "scale-1.08" : ""}`} style={{ backgroundColor: actor.bg }}>
              {actor.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-[#111827] mb-1">{actor.title}</div>
              <div className="text-sm text-[#6B7280] leading-relaxed mb-2">{actor.desc}</div>
              <div className="flex flex-wrap gap-1.25 mb-1.5">
                {actor.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border ${role === actor.id ? "bg-white border-[rgba(2,76,238,0.25)] text-[#024CEE]" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]"}`}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.75 ${role === actor.id ? "border-[#024CEE] bg-[#024CEE] scale-1.1" : "border-[#E5E7EB]"}`}>
              {role === actor.id && <span className="w-1.75 h-1.75 rounded-full bg-white" />}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-options for Provider */}
      {role === "provider" && (
        <div className="border-t border-[rgba(2,76,238,0.15)] pt-3.5 mt-3.5">
          <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-2.5">How do you work?</div>
          <div className="grid grid-cols-2 gap-2.5">
            {subOptions.map((sub) => (
              <div key={sub.id} onClick={() => onSubRoleChange(sub.id)} className={`border rounded-xl p-4 cursor-pointer transition-all relative ${subRole === sub.id ? "border-[#024CEE] bg-[#EBF1FD] shadow-[0_0_0_3px_rgba(2,76,238,0.1)]" : "border-[#E5E7EB] bg-white hover:border-[#93b4f7]"}`}>
                <div className={`absolute top-2.25 right-2.25 w-4.5 h-4.5 rounded-full bg-[#024CEE] text-white text-[10px] flex items-center justify-center transition-all ${subRole === sub.id ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>✓</div>
                <div className="text-2xl mb-2">{sub.icon}</div>
                <div className="text-sm font-semibold text-[#111827] mb-0.75">{sub.title}</div>
                <div className="text-xs text-[#6B7280]">{sub.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onContinue} disabled={!canContinue()} className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] disabled:opacity-40 disabled:cursor-not-allowed">
        Continue →
      </button>
    </div>
  );
};

export default RoleSelection;