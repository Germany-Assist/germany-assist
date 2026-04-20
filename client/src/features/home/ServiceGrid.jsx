import React from "react";

export default function ServiceGrid() {
  return (
    <section
      className="py-20 max-w-7xl mx-auto px-6"
      aria-labelledby="services-title"
    >
    <h2
      className="text-3xl font-bold text-white mb-12 text-center"
      id="services-title"
    >
      Comprehensive Solutions
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tall Box */}
      <div
        className="md:row-span-2 glass-card p-8 group hover:border-accent/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div
          className="w-12 h-12 bg-accent/10 rounded-xl mb-6 flex items-center justify-center text-accent"
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">Visa & Relocation</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Full legal support for Blue Card and working visas, ensuring a smooth transition to Germany.
        </p>
      </div>

      {/* Wide Box */}
      <div className="md:col-span-2 glass-card p-8 group hover:border-accent/50 transition-all flex flex-col md:flex-row gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-4">Executive Job Matching</h3>
          <p className="text-gray-400 text-sm">
            We connect you with Germany's hidden champions and DAX companies.
          </p>
        </div>

        <div
          className="bg-dark-950 rounded-xl p-4 border border-white/5 flex-1 shadow-inner"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={94}
          aria-label="Match Rate: 94%"
        >
          <div className="flex justify-between text-xs mb-2 text-gray-500">
            <span>Match Rate</span>
            <span>94%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-[94%] shadow-[0_0_10px_#22d3ee]" />
          </div>
        </div>
      </div>

      {/* Small Boxes */}
      <div className="glass-card p-8 group hover:border-accent/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <h3 className="text-lg font-bold text-white">Housing</h3>
        <p className="text-gray-400 text-xs mt-2">
          Personalized search for your new home.
        </p>
      </div>

      <div className="glass-card p-8 group hover:border-accent/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <h3 className="text-lg font-bold text-white">Integration</h3>
        <p className="text-gray-400 text-xs mt-2">
          Language and cultural coaching.
        </p>
      </div>
    </div>
  </section>
  );
}
