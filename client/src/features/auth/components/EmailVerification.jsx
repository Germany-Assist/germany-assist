import React, { useState, useRef } from "react";

const EmailVerification = ({ email, onVerify, onResend, error, setError }) => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    value = value.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    onVerify(enteredCode);
  };

  const isComplete = code.every((d) => d);

  return (
    <div className="w-full max-w-[560px]">
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-3.5">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className=" flex flex-col items-center text-center py-1.5">
        <div className="w-16 h-16 rounded-full bg-[#EBF1FD] flex items-center justify-center text-3xl mx-auto mb-4">
          📬
        </div>
        <div className="text-xl font-bold text-[#111827] mb-1.5">
          Verify Your Email
        </div>
        {/* Email */}
        <div className="flex items-center justify-center mb-4 border-2 gap-2 w-fit px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full transition-all hover:bg-blue-100 group">
          <svg
            className="w-3.5 h-3.5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>

          <span className="text-sm font-medium text-blue-700">
            {email || "your@email.com"}
          </span>

          {/* Optional: A small "x" or "check" if needed */}
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
        </div>
        <div className="text-sm text-[#6B7280] max-w-[340px] mx-auto mb-2 leading-relaxed">
          We sent a 5-digit verification code to your email. Enter it below to
          activate your account.
        </div>
        <div className="text-xs text-[#9CA3AF] mb-0.5">
          Demo: use code <span className="text-[#024CEE] font-bold">12345</span>
        </div>
      </div>

      <div className="flex  justify-center my-4 gap-2">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-16 h-[60px] border-2 rounded-xl text-center text-xl font-bold text-[#111827] bg-white outline-none transition-all ${digit ? "border-sky-400" : "border-[#E5E7EB]"} focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.1)]`}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={!isComplete}
        className="w-full py-3 rounded-xl bg-[#024CEE] mb-2 text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Verify & Activate →
      </button>

      <div
        className="text-center mt-2.25 text-xs text-[#024CEE] cursor-pointer"
        onClick={onResend}
      >
        Didn't receive it? Resend code
      </div>

      <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mt-3.5">
        {[
          { icon: "✓", done: true, text: "Account created successfully" },
          { icon: "⏳", done: false, text: "Email verification pending" },
          {
            icon: "🔒",
            done: false,
            text: "Escrow protection ready on activation",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-2.5 px-3.5 text-sm text-[#6B7280] border-b border-[#E5E7EB] last:border-b-0"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.done ? "bg-[#D1FAE5] text-emerald-600" : "bg-[#EBF1FD] text-[#024CEE]"}`}
            >
              {item.icon}
            </div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailVerification;
