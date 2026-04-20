import React from "react";

const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
      <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block border border-accent/20">
        Our Mission
      </span>
      <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter italic uppercase">
        Your Bridge To <br /> <span className="text-accent">Germany.</span>
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
        Founded by Amr, Amer, and Hadi, Germany Assist was born from a simple realization: 
        the path from the Middle East to a career in Germany shouldn't be a maze. 
        We simplify the complex, connecting ambitious talent with world-class employers.
      </p>
    </section>
  );
};

export default AboutHero;