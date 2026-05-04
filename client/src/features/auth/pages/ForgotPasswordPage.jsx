import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyResetCode, resetPassword } from "../../../api/authService";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const codeInputs = useRef([]);
  const navigate = useNavigate();

  const startTimer = () => {
    setTimer(180);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const maskEmail = (email) => {
    const [local, domain] = email.split("@");
    return local[0] + "***" + local[local.length - 1] + "@" + domain;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendCode = async () => {
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
      startTimer();
      setTimeout(() => codeInputs.current[0]?.focus(), 200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    const newCode = pasted.split("").concat(Array(5).fill("")).slice(0, 5);
    setCode(newCode);
    if (pasted.length === 5) {
      codeInputs.current[4]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const codeStr = code.join("");
    if (codeStr.length < 5) {
      setError("Please enter the 5-digit code.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyResetCode(codeStr);
      setResetToken(result.newToken);
      setStep(3);
      setTimeout(() => document.getElementById("passwordInput")?.focus(), 200);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccessMsg("");
    try {
      await forgotPassword(email);
      setSuccessMsg("New code sent! Check your inbox.");
      startTimer();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  const getPasswordStrength = () => {
    const p = password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (p.length >= 12) score++;
    return score;
  };

  const passwordRequirements = [
    { id: "len", label: "At least 8 characters", met: password.length >= 8 },
    { id: "upper", label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lower", label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { id: "num", label: "Contains a number", met: /\d/.test(password) },
    { id: "sym", label: "Contains a special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const handleResetPassword = async () => {
    setError("");
    const allMet = passwordRequirements.every((r) => r.met);

    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (!allMet) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ token: resetToken, password });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLevel = [
    { label: "Very weak", color: "#DC2626", width: "20%" },
    { label: "Weak", color: "#F97316", width: "40%" },
    { label: "Fair", color: "#EAB308", width: "60%" },
    { label: "Strong", color: "#22C55E", width: "85%" },
    { label: "Very strong", color: "#16A34A", width: "100%" },
  ];
  const strength = getPasswordStrength();
  const strengthInfo = strengthLevel[Math.max(0, strength - 1)] || strengthLevel[0];

  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#E5E7EB]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-[#024CEE] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-base font-bold text-[#111827]">
            Germany<span className="text-[#024CEE]">Assists</span>
          </span>
        </Link>
        <Link to="/signin" className="text-sm text-[#6B7280] no-underline hover:text-[#024CEE] flex items-center gap-1.5">
          ← Back to Sign In
        </Link>
      </header>

      <div className="flex h-[calc(100vh-65px)] bg-[#f8faff]">
        <div className="flex-1 flex items-center justify-center p-5 overflow-auto">
          <div className="w-full max-w-[420px]">
            {step < 4 && (
              <>
                <div className="flex items-center gap-0 mb-7">
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                          s < step
                            ? "border-green-500 bg-green-500 text-white"
                            : s === step
                            ? "border-[#024CEE] bg-[#024CEE] text-white shadow-[0_0_0_4px_rgba(2,76,238,0.12)]"
                            : "border-[#E5E7EB] bg-white text-[#6B7280]"
                        }`}
                      >
                        {s < step ? "✓" : s}
                      </div>
                      {s < 3 && (
                        <div className={`flex-1 h-0.5 transition-all ${s < step ? "bg-green-500" : "bg-[#E5E7EB]"}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between mb-5">
                  {["Email", "Verify", "New Password"].map((label, i) => (
                    <span
                      key={label}
                      className={`text-[11px] font-medium text-center flex-1 ${
                        i + 1 === step ? "text-[#024CEE] font-bold" : i + 1 < step ? "text-green-500" : "text-[#6B7280]"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <div className="animate-fade-up">
                <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-2">Step 1 of 3</div>
                <h2 className="text-2xl font-extrabold mb-1.5">Forgot your password?</h2>
                <p className="text-sm text-[#6B7280] mb-5">Enter your email and we'll send you a reset code.</p>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Email address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">✉</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                      placeholder="you@example.com"
                      className="w-full py-2.5 pl-9 pr-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-bold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(2,76,238,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>

                <div className="text-center mt-4 text-sm text-[#6B7280]">
                  Remembered it? <Link to="/signin" className="text-[#024CEE] font-semibold no-underline hover:underline">Sign in instead</Link>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up">
                <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-2">Step 2 of 3</div>
                <h2 className="text-2xl font-extrabold mb-1.5">Check your email</h2>
                <p className="text-sm text-[#6B7280] mb-5">
                  We sent a 5-digit code to <b className="text-[#111827]">{maskEmail(email)}</b>
                </p>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm mb-4">
                    <span>✓</span>
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Verification code</label>
                  <div className="flex gap-2.5 justify-between">
                    {code.map((c, i) => (
                      <input
                        key={i}
                        ref={(el) => (codeInputs.current[i] = el)}
                        type="text"
                        maxLength={1}
                        value={c}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(e, i)}
                        onPaste={handleCodePaste}
                        className={`w-12 h-14 border rounded-xl text-center text-xl font-bold outline-none transition-all ${
                          c
                            ? "border-[#024CEE] bg-[#EBF4FF]"
                            : "border-[#E5E7EB] focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.1)]"
                        } ${error ? "border-red-500 bg-[#FEF2F2]" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#6B7280]">Didn't receive it?</span>
                  <button
                    onClick={handleResendCode}
                    disabled={timer > 0}
                    className="text-xs text-[#024CEE] font-semibold bg-none border-none cursor-pointer font-[Outfit] disabled:text-[#6B7280] disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `Resend (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")})` : "Resend code"}
                  </button>
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || code.join("").length < 5}
                  className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-bold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(2,76,238,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setCode(["", "", "", "", ""]);
                      setError("");
                    }}
                    className="text-sm text-[#6B7280] bg-none border-none cursor-pointer font-[Outfit]"
                  >
                    ← Use a different email
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-up">
                <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-2">Step 3 of 3</div>
                <h2 className="text-2xl font-extrabold mb-1.5">Create new password</h2>
                <p className="text-sm text-[#6B7280] mb-5">Choose a strong password you haven't used before.</p>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">New password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">🔒</span>
                    <input
                      id="passwordInput"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                      placeholder="At least 8 characters"
                      className="w-full py-2.5 pl-9 pr-10 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: strengthInfo.width, background: strengthInfo.color }}
                        />
                      </div>
                      <div className="text-[11px] mt-1" style={{ color: strengthInfo.color }}>
                        {strengthInfo.label}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mt-2">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.id}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${req.met ? "text-green-600" : "text-[#6B7280]"}`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                            req.met ? "bg-green-500 border-green-500 text-white" : "border-[#E5E7EB]"
                          }`}
                        >
                          ✓
                        </span>
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Confirm password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">🔒</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                      placeholder="Repeat your password"
                      className="w-full py-2.5 pl-9 pr-10 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer"
                    >
                      {showConfirmPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className={`text-xs mt-1.5 ml-1 ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                      {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-bold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(2,76,238,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      setStep(2);
                      setPassword("");
                      setConfirmPassword("");
                      setError("");
                    }}
                    className="text-sm text-[#6B7280] bg-none border-none cursor-pointer font-[Outfit]"
                  >
                    ← Back to code
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-up text-center">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 flex items-center justify-center text-4xl mx-auto mb-5">
                  🎉
                </div>
                <h2 className="text-2xl font-extrabold mb-2">Password reset!</h2>
                <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <button
                  onClick={() => navigate("/signin")}
                  className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-bold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(2,76,238,0.3)]"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;