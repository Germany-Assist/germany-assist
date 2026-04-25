import React, { useState } from "react";

const getPasswordStrength = (password) => {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password)) s++;
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
  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputBaseStyle} pr-10 ${
            error ? "border-red-500 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#024CEE]"
          }`}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
      {showStrength && value && (
        <div className="mt-2 flex gap-1 px-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i <= getPasswordStrength(value)
                  ? i <= 1
                    ? "bg-red-500"
                    : i <= 2
                    ? "bg-yellow-500"
                    : i <= 3
                    ? "bg-green-400"
                    : "bg-green-600"
                  : "bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;