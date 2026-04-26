import React from "react";
import { Link } from "react-router-dom";

const SigninHeader = () => {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#E5E7EB] bg-white">
      <Link to="/" className="flex items-center gap-2.25 no-underline gap-2">
        <div className="w-9 h-9 bg-[#024CEE] rounded-lg flex  items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="text-base font-bold text-[#111827] tracking-tight">
          Germany<span className="text-[#024CEE]">Assists</span>
        </span>
      </Link>
      <Link
        to="/signup"
        className="text-sm text-[#6B7280] no-underline whitespace-nowrap"
      >
        New here?{" "}
        <b className="text-[#024CEE] font-semibold">Create account →</b>
      </Link>
    </header>
  );
};

export default SigninHeader;
