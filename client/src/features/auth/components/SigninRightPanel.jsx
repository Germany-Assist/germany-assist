import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getErrorMessage } from "../../../api/errorMessages";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
const SigninRightPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    try {
      setIsLoading(true);
      await login({ email, password });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-5 bg-[#f8faff] relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[420px] text-left">
        <div className="text-xs font-semibold text-[#024CEE] uppercase tracking-wider mb-2">
          Welcome back
        </div>
        <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight mb-1.25">
          Sign in to your account
        </h2>
        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
          Thousands of people found their path in Germany. Yours starts here.
        </p>

        {/* Social Buttons */}
        <div className="flex gap-2.25 mb-3 h-11">
          <GoogleLoginButton signin={true} />
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-[#6B7280]">
          <span className="flex-1 h-px bg-[#E5E7EB]"></span>
          or sign in with email
          <span className="flex-1 h-px bg-[#E5E7EB]"></span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-3.5">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-2.5">
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm pointer-events-none">
                ✉
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 py-2.75 pl-9 pr-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)] transition-all"
              />
            </div>
          </div>

          <div className="mb-2.5">
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm pointer-events-none">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 py-2.75 pl-9 pr-9 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm cursor-pointer select-none p-1"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] text-white transition-all ${rememberMe ? "bg-[#024CEE] border-[#024CEE]" : "border-[#E5E7EB] bg-white"}`}
              >
                ✓
              </span>
              <span className="text-sm text-[#6B7280]">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#024CEE] no-underline font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-3.5 text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#024CEE] font-semibold no-underline hover:underline"
          >
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninRightPanel;
