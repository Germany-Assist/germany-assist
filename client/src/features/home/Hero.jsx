import React from "react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden "  aria-label="Hero section - Introduction and main call to action">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6"  aria-live="polite">
            <span className="relative flex h-2 w-2"  aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-accent text-xs font-bold tracking-widest uppercase">
              Live: 42 new roles today
            </span>
          </div>

          <h1 className="text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
              future
            </span>{" "}
            in Germany.
          </h1>

          <p className="mt-8 text-gray-400 text-xl max-w-md leading-relaxed">
            Premium placement services for elite talent. We don't just find
            jobs; we build lives.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button type="button" className="px-8 py-4 bg-accent text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:-translate-y-1 transition-all duration-300 focus-visible:outline  focus-visible:outline-2  focus-visible:outline-accent">
              Explore Opportunities
            </button>
            <button type="button" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all focus-visible:outline  focus-visible:outline-2  focus-visible:outline-white">
              How it works
            </button>
          </div>
        </div>

        {/* The "Engaging" Visual: Interactive Floating Cards */}
        <div className="relative h-[500px] hidden lg:block" aria-hidden="true">
          {/* Card 1: The Candidate */}
          <div className="absolute top-0 right-0 glass-card p-6 w-64 animate-float motion-reduce:hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent to-blue-500" />
              <div>
                <p className="text-white font-bold text-sm">Alex M.</p>
                <p className="text-gray-500 text-xs">Software Engineer</p>
              </div>
            </div>
            <div className="space-y-2" 
              role="progressbar"
              aria-valuenow={80}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Visa approval progress">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[80%]"></div>
              </div>
              <p className="text-[10px] text-accent uppercase font-bold tracking-tighter">
                Visa Status: Approved
              </p>
            </div>
          </div>

          {/* Card 2: The Job Offer */}
          <div className="absolute bottom-10 left-10 glass-card p-6 w-72 animate-float [animation-delay:2s] border-accent/20 motion-reduce:hidden">
            <p className="text-xs text-gray-500 mb-1 font-mono tracking-tighter">
              NEW OFFER
            </p>
            <p className="text-white font-bold mb-3">Senior Product Designer</p>
            <div className="flex justify-between items-center">
              <span className="text-accent font-bold">€85k - €105k</span>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded">
                Berlin
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
