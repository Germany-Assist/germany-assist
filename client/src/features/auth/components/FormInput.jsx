import React from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// Make sure to import the CSS in your main file or here
import "react-phone-number-input/style.css";

const FormInput = ({
  label,
  value,
  onChange,
  onBlur,
  onInput,
  type = "text",
  placeholder,
  required = false,
  error = "",
  inputBaseStyle,
  autoComplete,
}) => {
  // Custom wrapper for the phone input's onChange
  const handlePhoneChange = (val) => {
    if (onChange) onChange(val);
    if (onInput) onInput(val);
  };

  const handleStandardInput = (e) => {
    if (onInput) onInput(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#111827] mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {type === "tel" ? (
        <PhoneInput
          international
          defaultCountry="DE" // Germany default
          value={value}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`phone-input-container ${inputBaseStyle} ${
            error
              ? "border-red-500 ring-1 ring-red-500"
              : "border-[#E5E7EB] focus-within:border-[#024CEE] focus-within:ring-1 focus-within:ring-[#024CEE]"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleStandardInput}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${inputBaseStyle} ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#E5E7EB] focus:border-[#024CEE]"
          }`}
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default FormInput;
