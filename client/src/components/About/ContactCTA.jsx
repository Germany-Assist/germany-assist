import React from "react";
import { ArrowRight } from "lucide-react";

const ContactCTA = () => {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto text-center">
      <div className="bg-accent/5 border border-accent/20 rounded-[32px] p-12 relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic uppercase">Start Your Journey</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">Ready to move? Book a consultation directly with our founders.</p>
            <button className="bg-accent text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all flex items-center mx-auto gap-2 group">
            Contact Us 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;