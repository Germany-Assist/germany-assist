import React, { useState, useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";

const BasicInfoForm = ({
  role,
  subRole,
  onBack,
  onContinue,
  error,
  setError,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateName = (name) => {
    // Pattern: Letters, spaces, hyphens, and apostrophes only
    const regex = /^[a-zA-Z\s'-]*$/;
    return regex.test(name);
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    if (validateName(value)) {
      setFirstName(value);
      setError(""); // Clear error if they fix the typo
    } else {
      // Optional: set a specific error message
      setError(
        "Names can only contain letters, spaces, hyphens, or apostrophes.",
      );
    }
  };
  const handleLastNameChange = (e) => {
    const value = e.target.value;
    if (validateName(value)) {
      setLastName(value);
      setError(""); // Clear error if they fix the typo
    } else {
      // Optional: set a specific error message
      setError(
        "Names can only contain letters, spaces, hyphens, or apostrophes.",
      );
    }
  };
  // Your reusable style string
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

  const getPasswordStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  };

  const handleSubmit = () => {
    if (
      !firstName ||
      !lastName ||
      !displayName ||
      !email ||
      !phone ||
      !country
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    setError("");
    onContinue({
      firstName,
      lastName,
      displayName,
      country,
      email,
      phone,
      password,
    });
  };

  return (
    <div className="w-full max-w-[560px] text-left">
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5 pl-2.5 pr-2.5"
      >
        <span className="flex items-center">←</span> Back
      </button>

      <div className="text-xl font-bold text-[#111827] mb-1">
        {role === "provider"
          ? subRole === "office"
            ? "Office Account"
            : "Freelancer Account"
          : "Individual Account"}
      </div>

      <div className="text-sm text-[#6B7280] mb-5.5">
        Fill in your details to get started.
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="flex w-full justify-left pt-3 pb-3">
        <GoogleLoginButton authStyle={"flex items-center justify-left"} />
      </div>

      <div className="mb-5">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3 flex items-center gap-1.5">
          Basic Information <span className="text-red-600">* Required</span>
        </div>

        {/* 1. NAME GRID */}
        <div className="grid grid-cols-2 gap-4 mb-2.5">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e)}
              placeholder="Ahmed"
              className={inputBaseStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleLastNameChange(e)}
              placeholder="Mohamed"
              className={inputBaseStyle}
            />
          </div>
        </div>

        {/* 2. COUNTRY */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Country <span className="text-red-600">*</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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
              {isLoadingCountries ? "Loading..." : "Select your country"}
            </option>
            {countries.map((c) => (
              <option key={c.cca2} value={c.name.common}>
                {c.name.common}
              </option>
            ))}
          </select>
        </div>

        {/* 3. DISPLAY NAME */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Display Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How you'll appear"
            className={inputBaseStyle}
          />
          <p className="text-[11px] text-[#6B7280] mt-1 ml-1">
            This name will be shown publicly on your profile.
          </p>
        </div>

        {/* 4. EMAIL & PHONE */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputBaseStyle}
          />
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+20 100 000 0000"
            className={inputBaseStyle}
          />
        </div>

        {/* 5. PASSWORD */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className={`${inputBaseStyle} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex gap-1 px-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${i <= getPasswordStrength() ? "bg-[#024CEE]" : "bg-[#E5E7EB]"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 6. CONFIRM PASSWORD */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className={`w-full py-2.5 px-3 pr-10 border-2 rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)] ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E7EB] focus:border-[#024CEE]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
          {confirmPassword && (
            <div
              className={`text-xs mt-1.5 ml-1 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}
            >
              {password === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => setAgreedToTerms(!agreedToTerms)}
        className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-[#E5E7EB] cursor-pointer transition-all mb-3.5 hover:border-[#93b4f7]"
      >
        <span
          className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center text-[9px] ${agreedToTerms ? "bg-[#024CEE] border-[#024CEE] text-white" : "border-[#E5E7EB] bg-white"}`}
        >
          {agreedToTerms && "✓"}
        </span>
        <div className="text-sm text-[#6B7280]">
          I agree to the{" "}
          <span className="text-[#024CEE] font-medium">Terms</span> and{" "}
          <span className="text-[#024CEE] font-medium">Privacy Policy</span>.
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] shadow-md active:scale-[0.98]"
      >
        Continue →
      </button>
    </div>
  );
};

export default BasicInfoForm;
