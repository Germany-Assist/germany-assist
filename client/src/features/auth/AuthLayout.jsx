import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/ui/logo";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center py-12 px-4 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-4 group">
            <div className=" border border-black p-2 rounded-xl group-hover:border-cyan-500/50 transition-all">
              <Logo className="w-60" href={"/"} />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-gray-400 text-sm mt-2 font-light">{subtitle}</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-black">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
