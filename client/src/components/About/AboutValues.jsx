import React from "react";
import { Globe, Briefcase, Rocket } from "lucide-react";

const AboutValues = () => {
  const values = [
    { icon: <Globe className="text-accent" />, label: "Region Focused", desc: "Tailored support for Middle Eastern professionals." },
    { icon: <Briefcase className="text-accent" />, label: "Verified Jobs", desc: "Direct partnerships with Germany's top-tier firms." },
    { icon: <Rocket className="text-accent" />, label: "End-to-End", desc: "From visa assistance to your first day at work." }
  ];

  return (
    <section className="py-20 bg-light-900/50 dark:bg-white/5 border-y border-light-700 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {values.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-white dark:bg-dark-800 rounded-2xl border border-light-700 dark:border-white/10 shadow-xl">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.label}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutValues;