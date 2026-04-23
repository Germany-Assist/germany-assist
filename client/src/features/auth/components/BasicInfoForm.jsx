import React, { useState } from "react";

const BasicInfoForm = ({ role, subRole, onBack, onContinue, error, setError }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const getPasswordStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !displayName || !email || !phone) {
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
    onContinue({ firstName, lastName, displayName, country, email, phone, password });
  };

  return (
    <div className="w-full max-w-[560px]">
      <button onClick={onBack} className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4.5">
        ← Back
      </button>

      <div className="text-xl font-bold text-[#111827] mb-1">
        {role === "provider" ? (subRole === "office" ? "Office / Organization Account" : "Freelancer Account") : "Individual Account"}
      </div>
      <div className="text-sm text-[#6B7280] mb-5.5">
        {role === "provider" ? "Independent professional · Badge verification" : "Free access · No transaction fees · Full platform access"}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3 flex items-center gap-1.5">
          Basic Information <span className="text-red-600">* Required</span>
        </div>

        <div className="grid grid-cols-2 gap-2.25 mb-2.5">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ahmed" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Mohamed" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
          </div>
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Display Name <span className="text-red-600">*</span></label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="How you'll appear on the platform" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Country <span className="text-red-600">*</span></label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="🔍  Search your country..." className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Email Address <span className="text-red-600">*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Phone Number <span className="text-red-600">*</span></label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 100 000 0000" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Password <span className="text-red-600">*</span></label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full py-2.5 px-3 pr-10 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">{showPassword ? "🙈" : "👁"}</button>
          </div>
          {password && (
            <div className="mt-1.5">
              <div className="flex gap-0.75 mb-1">
                {[1,2,3,4].map(i => <div key={i} className={`flex-1 h-0.75 rounded-sm ${i <= getPasswordStrength() ? (getPasswordStrength()===1?"bg-red-500":getPasswordStrength()===2?"bg-yellow-400":getPasswordStrength()===3?"bg-sky-400":"bg-emerald-400") : "bg-[#E5E7EB]"}`} />)}</div>
            </div>
          )}
        </div>

        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Confirm Password <span className="text-red-600">*</span></label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
          {confirmPassword && <div className="text-xs mt-0.75" style={{color: password === confirmPassword ? "#16A34A" : "#DC2626"}}>{password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}</div>}
        </div>
      </div>

      <div onClick={() => setAgreedToTerms(!agreedToTerms)} className="flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all mb-3.5 hover:border-[#93b4f7]">
        <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="hidden" />
        <span className={`w-4 h-4 rounded border flex-shrink-0 mt-0.25 flex items-center justify-center text-[9px] ${agreedToTerms ? "bg-[#024CEE] border-[#024CEE] text-white" : "border-[#E5E7EB] bg-white"}`}>✓</span>
        <div className="text-sm text-[#6B7280]">I agree to the <span className="text-[#024CEE]">Terms of Service</span> and <span className="text-[#024CEE]">Privacy Policy</span>.</div>
      </div>

      <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc]">
        Continue →
      </button>
    </div>
  );
};

export default BasicInfoForm;