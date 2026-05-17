import React, { useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelect = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
}) => {
  // 1. Get standardized list
  const options = useMemo(() => countryList().getData(), []);

  // 2. Helper to get the flag emoji
  const getFlagEmoji = (cc) => {
    if (!cc) return "";
    return cc
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(char.charCodeAt(0) + 127397),
      );
  };

  // 3. Format options: Store the CODE (value), Show the FLAG + NAME (label)
  const customOptions = useMemo(() => {
    return options.map((opt) => ({
      value: opt.value, // e.g., "DE"
      label: `${getFlagEmoji(opt.value)} ${opt.label}`, // e.g., "🇩🇪 Germany"
      plainLabel: opt.label, // Useful for internal searching
    }));
  }, [options]);

  // 4. Find the current selection based on the CODE in your state
  const currentSelection = customOptions.find((o) => o.value === value) || null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#111827] mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <Select
        options={customOptions}
        isClearable={true}
        value={currentSelection}
        // Pass the CODE (DE) back to the form state
        onChange={(opt) => onChange(opt ? opt.value : null)}
        placeholder={placeholder}
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: "0.75rem",
            minHeight: "45px",
            borderColor: error
              ? "#ef4444"
              : state.isFocused
                ? "#024CEE"
                : "#E5E7EB",
            boxShadow: "none",
            "&:hover": { borderColor: error ? "#ef4444" : "#E5E7EB" },
          }),
        }}
      />
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default CountrySelect;
