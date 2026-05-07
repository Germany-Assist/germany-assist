import React from "react";

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
  const handleInput = (e) => {
    // Trigger onInput for browser autofill
    if (onInput) onInput(e.target.value);
    // Also call onChange
    if (onChange) onChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleInput}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputBaseStyle} ${
          error ? "border-red-500 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#024CEE]"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default FormInput;