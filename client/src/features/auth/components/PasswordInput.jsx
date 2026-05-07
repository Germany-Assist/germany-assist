import React, { useState } from "react";

const getPasswordStrength = (password) => {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[a-z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
};

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  showPassword,
  onTogglePassword,
  showStrength = false,
  inputBaseStyle,
}) => {
  const inputStyle = inputBaseStyle || "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  return (
    <div>
      <label className="block text-[0.8rem] font-medium text-[#111827] mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-[15px] pointer-events-none">🔒</span>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputStyle} pl-10 pr-10 ${
            error ? "border-red-500 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#024CEE]"
          }`}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm cursor-pointer select-none p-1"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
      {error && <p className="text-[0.73rem] text-red-600 mt-[5px] ml-1 flex items-center gap-1">⚠ {error}</p>}
      {showStrength && value && (
        <>
          <div className="mt-2 flex gap-1 px-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  i <= getPasswordStrength(value)
                    ? i <= 1
                      ? "bg-[#49B7DF]"
                      : i <= 2
                      ? "bg-[#024CEE]"
                      : i <= 3
                      ? "bg-[#024CEE]"
                      : i <= 4
                      ? "bg-[#024CEE]"
                      : "bg-[#0229a8]"
                    : "bg-[#E5E7EB]"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.65rem] ${value.length >= 8 ? "border-green-400 bg-green-50 text-green-700" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]"}`}>
              {value.length >= 8 ? "✓" : "○"} 8+ chars
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.65rem] ${/[A-Z]/.test(value) ? "border-green-400 bg-green-50 text-green-700" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]"}`}>
              {/[A-Z]/.test(value) ? "✓" : "○"} Uppercase
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.65rem] ${/[a-z]/.test(value) ? "border-green-400 bg-green-50 text-green-700" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]"}`}>
              {/[a-z]/.test(value) ? "✓" : "○"} Lowercase
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.65rem] ${/[0-9]/.test(value) ? "border-green-400 bg-green-50 text-green-700" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]"}`}>
              {/[0-9]/.test(value) ? "✓" : "○"} Number
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.65rem] ${/[^A-Za-z0-9]/.test(value) ? "border-green-400 bg-green-50 text-green-700" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]"}`}>
              {/[^A-Za-z0-9]/.test(value) ? "✓" : "○"} Special
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordInput;