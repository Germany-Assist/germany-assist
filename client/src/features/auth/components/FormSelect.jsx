import React, { useState, useMemo } from "react";

const flagEmojis = {
  AD: "🇦🇩", AE: "🇦🇪", AF: "🇦🇫", AG: "🇦🇬", AI: "🇦🇮", AL: "🇦🇱", AM: "🇦🇲", AO: "🇦🇴", AQ: "🇦🇶", AR: "🇦🇷",
  AS: "🇸🇧", AT: "🇦🇹", AU: "🇦🇺", AW: "🇦🇼", AX: "🇦🇽", AZ: "🇦🇿", BA: "🇧🇦", BB: "🇧🇧", BD: "🇧🇩", BE: "🇧🇪",
  BF: "🇧🇫", BG: "🇧🇬", BH: "🇧🇭", BI: "🇧🇮", BJ: "🇧🇯", BL: "🇧🇱", BM: "🇧🇲", BN: "🇧🇳", BO: "🇧🇴", BQ: "🇧🇶",
  BR: "🇧🇷", BS: "🇧🇸", BT: "🇧🇹", BV: "🇧🇻", BW: "🇧🇼", BY: "🇧🇾", BZ: "🇧🇿", CA: "🇨🇦", CC: "🇨🇨", CD: "🇨🇩",
  CF: "🇨🇫", CG: "🇨🇬", CH: "🇨🇭", CI: "🇨🇮", CK: "🇨🇰", CL: "🇨🇱", CM: "🇨🇲", CN: "🇨🇳", CO: "🇨🇴", CR: "🇨🇷",
  CU: "🇨🇺", CV: "🇨🇻", CW: "🇨🇼", CX: "🇨🇾", CY: "🇨🇾", CZ: "🇨🇿", DE: "🇩🇪", DJ: "🇩🇯", DK: "🇩🇰", DM: "🇩🇲",
  DO: "🇩🇴", DZ: "🇩🇿", EC: "🇪🇨", EE: "🇪🇪", EG: "🇪🇬", EH: "🇪🇭", ER: "🇪🇷", ES: "🇪🇸", ET: "🇪🇹", FI: "🇫🇮",
  FJ: "🇫🇯", FK: "🇫🇰", FM: "🇫🇲", FO: "🇫🇴", FR: "🇫🇷", GA: "🇬🇦", GB: "🇬🇧", GD: "🇬🇩", GE: "🇬🇪", GF: "🇬🇫",
  GG: "🇬🇬", GH: "🇬🇭", GI: "🇬🇮", GL: "🇬🇱", GM: "🇬🇲", GN: "🇬🇳", GP: "🇬🇵", GQ: "🇬🇶", GR: "🇬🇷", GS: "🇬🇸",
  GT: "🇬🇹", GU: "🇬🇺", GW: "🇬🇼", GY: "🇬🇾", HK: "🇭🇰", HM: "🇭🇲", HN: "🇭🇳", HR: "🇭🇷", HT: "🇭🇹", HU: "🇭🇺",
  ID: "🇮🇩", IE: "🇮🇪", IL: "🇮🇱", IM: "🇮🇲", IN: "🇮🇳", IO: "🇮🇴", IQ: "🇮🇶", IR: "🇮🇷", IS: "🇮🇸", IT: "🇮🇹",
  JE: "🇯🇪", JM: "🇯🇲", JO: "🇯🇴", JP: "🇯🇵", KE: "🇰🇪", KG: "🇰🇬", KH: "🇰🇭", KI: "🇰🇮", KM: "🇰🇲", KN: "🇰🇳",
  KP: "🇰🇵", KR: "🇰🇷", KW: "🇰🇼", KY: "🇰🇾", KZ: "🇰🇿", LA: "🇱🇦", LB: "🇱🇧", LC: "🇱🇨", LI: "🇱🇮", LK: "🇱🇰",
  LR: "🇱🇷", LS: "🇱🇸", LT: "🇱🇹", LU: "🇱🇺", LV: "🇱🇻", LY: "🇱🇾", MA: "🇲🇦", MC: "🇲🇨", MD: "🇲🇩", ME: "🇲🇪",
  MF: "🇲🇫", MG: "🇲🇬", MH: "🇲🇭", MK: "🇲🇰", ML: "🇲🇱", MM: "🇲🇲", MN: "🇲🇳", MO: "🇲🇴", MP: "🇲🇵", MQ: "🇲🇶",
  MR: "🇲🇷", MS: "🇲🇸", MT: "🇲🇹", MU: "🇲🇺", MV: "🇲🇻", MW: "🇲🇼", MX: "🇲🇽", MY: "🇲🇾", MZ: "🇲🇿", NA: "🇳🇦",
  NC: "🇳🇨", NE: "🇳🇪", NF: "🇳🇫", NG: "🇳🇬", NI: "🇳🇮", NL: "🇳🇱", NO: "🇳🇴", NP: "🇳🇵", NR: "🇳🇷", NU: "🇳🇺",
  NZ: "🇳🇿", OM: "🇴🇲", PA: "🇵🇦", PE: "🇵🇪", PF: "🇵🇫", PG: "🇵🇬", PH: "🇵🇭", PK: "🇵🇰", PL: "🇵🇱", PM: "🇵🇲",
  PN: "🇵🇳", PR: "🇵🇷", PS: "🇵🇸", PT: "🇵🇹", PW: "🇵🇼", PY: "🇵🇾", QA: "🇶🇦", RE: "🇷🇪", RO: "🇷🇴",
  RS: "🇷🇸", RU: "🇷🇺", RW: "🇷🇼", SA: "🇸🇦", SB: "🇸🇧", SC: "🇸🇨", SD: "🇸🇩", SE: "🇸🇪", SG: "🇸🇬", SH: "🇸🇭",
  SI: "🇸🇮", SJ: "🇸🇯", SK: "🇸🇰", SL: "🇸🇱", SM: "🇸🇲", SN: "🇸🇳", SO: "🇸🇴", SR: "🇸🇷", SS: "🇸🇸", ST: "🇸🇹",
  SV: "🇸🇻", SX: "🇸🇽", SY: "🇸🇾", SZ: "🇸🇿", TC: "🇹🇨", TD: "🇹🇩", TF: "🇹🇫", TG: "🇹🇬", TH: "🇹🇭", TJ: "🇹🇯",
  TK: "🇹🇰", TL: "🇹🇱", TM: "🇹🇲", TN: "🇹🇳", TO: "🇹🇴", TR: "🇹🇷", TT: "🇹🇹", TV: "🇹🇻", TW: "🇹🇼", TZ: "🇹🇿",
  UA: "🇺🇦", UG: "🇺🇬", UM: "🇺🇲", US: "🇺🇸", UY: "🇺🇾", UZ: "🇺🇿", VA: "🇻🇦", VC: "🇻🇨", VE: "🇻🇪", VG: "🇻🇬",
  VI: "🇻🇮", VN: "🇻🇳", VU: "🇻🇺", WF: "🇼🇫", WS: "🇼🇸", XK: "🇽🇰", YE: "🇾🇪", YT: "🇾🇹", ZA: "🇿🇦", ZM: "🇿🇲",
  ZW: "🇿🇼",
};

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error = "",
  inputBaseStyle,
  isLoading = false,
  allowCustom = false,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.name.common.toLowerCase().includes(searchLower) ||
        opt.cca2.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.name.common === value);

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      setIsOpen(false);
      setSearch("");
      setCustomInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`${inputBaseStyle} appearance-none cursor-pointer flex items-center justify-between ${
            error ? "border-red-500 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#024CEE]"
          }`}
        >
          <span className="flex items-center gap-2">
            {selectedOption && (
              <span className="text-lg">
                {flagEmojis[selectedOption.cca2] || "🌍"}
              </span>
            )}
            <span className={value ? "text-[#111827]" : "text-[#9CA3AF]"}>
              {value || placeholder}
            </span>
          </span>
          <span className="text-[#6B7280]">▼</span>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg max-h-72 overflow-hidden">
            <div className="p-2 border-b border-[#E5E7EB]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full py-2 px-3 border border-[#E5E7EB] rounded-lg text-sm outline-none focus:border-[#024CEE]"
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {isLoading ? (
                <div className="p-3 text-sm text-[#6B7280]">Loading...</div>
              ) : filteredOptions.length === 0 ? (
                allowCustom ? (
                  <div className="p-2">
                    <div className="text-xs text-[#6B7280] mb-2">No countries found. Type to add custom:</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter country name..."
                        className="flex-1 py-2 px-3 border border-[#E5E7EB] rounded-lg text-sm outline-none focus:border-[#024CEE]"
                        onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                      />
                      <button
                        onClick={handleCustomSubmit}
                        className="px-3 py-2 bg-[#024CEE] text-white rounded-lg text-sm font-medium hover:bg-[#0341cc]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-sm text-[#6B7280]">No results found</div>
                )
              ) : (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.cca2}
                    onClick={() => {
                      onChange(opt.name.common);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`p-2 px-3 cursor-pointer flex items-center gap-2 hover:bg-[#F3F4F6] ${
                      value === opt.name.common ? "bg-[#EBF1FD]" : ""
                    }`}
                  >
                    <span className="text-lg">{flagEmojis[opt.cca2] || "🌍"}</span>
                    <span className="text-sm">{opt.name.common}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default FormSelect;