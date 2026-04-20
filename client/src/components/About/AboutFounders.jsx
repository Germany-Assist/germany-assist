import React from "react";
import { Users } from "lucide-react";

const AboutFounders = () => {
  const founders = [
    { name: "Amr", role: "Co-Founder / Operations", bio: "Bridging the gap between Middle Eastern talent and German industrial standards." },
    { name: "Amer", role: "Co-Founder / Strategy", bio: "Expert in navigating German labor laws and immigration frameworks." },
    { name: "Hadi", role: "Co-Founder / Technology", bio: "Building the digital infrastructure that connects talent with opportunity." },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">The Visionaries</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">The team making the German dream accessible.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {founders.map((founder, idx) => (
          <div key={idx} className="group bg-white dark:bg-dark-900/50 p-8 rounded-[32px] border border-light-700 dark:border-white/10 transition-all duration-500 hover:border-accent/50 hover:-translate-y-2">
            <div className="w-16 h-16 bg-light-800 dark:bg-dark-800 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <Users className="text-slate-400 group-hover:text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{founder.name}</h3>
            <p className="text-accent text-xs font-black uppercase tracking-widest mb-4">{founder.role}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{founder.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutFounders;