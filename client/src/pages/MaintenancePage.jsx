import React from "react";
import { Construction, Instagram, Twitter, Mail } from "lucide-react";
import NavigationBar from "../components/ui/NavigationBar";

function MaintenancePage({ nav = true }) {
  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 selection:bg-amber-500/30">
      {nav && <NavigationBar />}

      {/* 1. MATCHING AMBIENT GLOWS (From your Dashboard) */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-400/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 2. REPLACED DATA-SVG WITH PURE TAILWIND GRID (Build-Safe) */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
        {/* Animated Icon Pod */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition duration-1000"></div>
          <div className="relative w-28 h-28 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
            <Construction
              size={44}
              className="text-amber-500 animate-bounce [animation-duration:3s]"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">
            System Upgrade in Progress
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black text-zinc-900 dark:text-white text-center mb-8 tracking-tighter italic leading-none">
          STAY <br /> <span className="text-amber-500">TUNED.</span>
        </h1>

        {/* Glass Content Card */}
        <div className="w-full max-w-md bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-2xl text-center">
          <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-10 leading-relaxed">
            We are refining our digital workspace to bring you a more seamless
            experience. Join the waitlist for updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 ring-amber-500/50 transition-all dark:text-white"
              />
            </div>
            <button className="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-amber-500/10">
              Notify
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex gap-10">
          {[Twitter, Instagram].map((Icon, i) => (
            <Icon
              key={i}
              className="text-zinc-400 hover:text-amber-500 cursor-pointer transition-all duration-300 hover:scale-110"
              size={22}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
