import React from "react";
import { Search, Home, ArrowLeft, Ghost, MoveLeft, Rocket } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-lg p-8">
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-[48px] p-12 shadow-2xl text-center">
          {/* Floating Icon Section */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[40px] border border-white/10 flex items-center justify-center shadow-inner">
              <Ghost
                size={64}
                className="text-white animate-[bounce_3s_infinite]"
              />
            </div>
          </div>

          <h1 className="text-7xl font-[1000] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-4 tracking-tighter">
            404
          </h1>

          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
            Page Vanished
          </h2>

          <p className="text-zinc-400 mb-10 text-lg font-medium leading-relaxed">
            The coordinates you entered don't exist in this sector.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-white/5"
            >
              <MoveLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-black py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Rocket size={16} /> Rescue Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
