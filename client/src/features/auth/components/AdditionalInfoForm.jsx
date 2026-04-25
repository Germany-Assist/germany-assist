import React, { useState, useEffect } from "react";

const AdditionalInfoForm = ({
  error,
  role,
  subRole,
  onBack,
  onContinue,
  onSkip,
}) => {
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  // Single state object for all form data
  const [formData, setFormData] = useState({
    countryOfResidence: "",
    orgName: "",
    idDoc: null,
    proofRes: null,
    bizReg: null,
  });
  // Generic update function
  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Consistent styling
  const inputBaseStyle =
    "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common),
        );
        setCountries(sorted);
        setIsLoadingCountries(false);
      })
      .catch(() => setIsLoadingCountries(false));
  }, []);

  return (
    <div className="w-full max-w-[560px] text-left">
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-3 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
      >
        <span>←</span> Back
      </button>

      <div className="text-xl font-bold text-[#111827] mb-1">
        Additional Details
      </div>
      <div className="text-sm text-[#6B7280] mb-6">
        Help us verify your account faster and match you with the right
        opportunities.
      </div>

      {/* 1. COUNTRY DROPDOWN */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3">
          Location
        </div>
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Country of Residence
          </label>
          <select
            value={formData.countryOfResidence}
            onChange={(e) => updateField("countryOfResidence", e.target.value)}
            className={`${inputBaseStyle} appearance-none cursor-pointer`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            <option value="">
              {isLoadingCountries ? "Loading..." : "Select country"}
            </option>
            {countries.map((c) => (
              <option key={c.cca2} value={c.name.common}>
                {c.name.common}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. ORGANIZATION (Conditional) */}
      {role === "provider" && subRole === "office" && (
        <div className="mb-6">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3">
            Organization
          </div>
          <div className="mb-2.5">
            <label className="block text-sm font-medium text-[#111827] mb-1">
              Organization / Company Name
            </label>
            <input
              type="text"
              value={formData.orgName}
              onChange={(e) => updateField("orgName", e.target.value)}
              placeholder="Official registered name"
              className={inputBaseStyle}
            />
          </div>
        </div>
      )}

      {/* 3. IDENTITY VERIFICATION */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3 flex items-center gap-1.5">
          Identity Verification
          <span className="font-normal text-[#9CA3AF] text-[10px] uppercase">
            — PDF, JPG, PNG · MAX 5MB
          </span>
        </div>

        {/* Passport/ID */}
        <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center cursor-pointer bg-[#F9FAFB] relative mb-3 hover:bg-[#F3F4F6] transition-all">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => updateField("idDoc", e.target.files[0])}
          />
          <div className="text-2xl mb-1">🪪</div>
          <div className="text-sm text-[#024CEE] font-medium">
            Upload Passport or National ID
          </div>
          {formData.idDoc && (
            <div className="text-xs text-emerald-600 mt-1 font-medium">
              ✓ {formData.idDoc.name}
            </div>
          )}
        </div>

        {role === "provider" && subRole === "office" && (
          <>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center cursor-pointer bg-[#F9FAFB] relative mb-3 hover:bg-[#F3F4F6] transition-all">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => updateField("proofRes", e.target.files[0])}
              />
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-sm text-[#024CEE] font-medium">
                Proof of Residence
              </div>
              {formData.proofRes && (
                <div className="text-xs text-emerald-600 mt-1 font-medium">
                  ✓ {formData.proofRes.name}
                </div>
              )}
            </div>

            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center cursor-pointer bg-[#F9FAFB] relative hover:bg-[#F3F4F6] transition-all">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => updateField("bizReg", e.target.files[0])}
              />
              <div className="text-2xl mb-1">📋</div>
              <div className="text-sm text-[#024CEE] font-medium">
                Business Registration (PDF)
              </div>
              {formData.bizReg && (
                <div className="text-xs text-emerald-600 mt-1 font-medium">
                  ✓ {formData.bizReg.name}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* SUBMIT BUTTONS */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onContinue(formData)}
          className="w-full py-3.5 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] shadow-sm active:scale-[0.99]"
        >
          Submit & Verify Email →
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-xl border-2 border-[#E5E7EB] text-sm text-[#6B7280] font-medium cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
        >
          Skip for now — verify my email
        </button>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
