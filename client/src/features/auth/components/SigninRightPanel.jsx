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
    <div className="flex-1 flex flex-col items-center py-9 px-5 overflow-y-auto">
      <div className="w-full max-w-[560px]">
        <div className="text-[1.35rem] font-bold text-[#111827] tracking-tight mb-1">
          Sign in to your account
        </div>
        <div className="text-[0.83rem] text-[#6B7280] mb-5 leading-relaxed">
          Welcome back! Sign in to access your dashboard and connect with services.
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-2.25 mb-4">
          <GoogleLoginButton
            signin={true}
            authStyle={
              "flex items-center justify-center gap-2.5 w-full py-[11px] border border-[#E5E7EB] rounded-[10px] bg-white text-[0.86rem] font-medium text-[#111827] cursor-pointer transition-all hover:bg-[#F9FAFB] hover:-translate-y-0.5"
            }
          />
        </div>

        <div className="flex items-center gap-3 mb-4 text-[0.76rem] text-[#6B7280]">
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 py-2.75 px-3 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] bg-white outline-none transition-all focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
              />
            </div>
          </div>

          <div className="mb-2.5">
            <label className="block text-xs font-medium text-[#111827] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 py-2.75 px-3 pr-9 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] bg-white outline-none transition-all focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm cursor-pointer select-none"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[9px] text-white transition-all ${rememberMe ? "bg-[#024CEE] border-[#024CEE]" : "border border-[#E5E7EB] bg-white"}`}
                style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
              >
                {rememberMe && "✓"}
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
            className="w-full py-3 rounded-lg bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ boxShadow: '0 2px 10px rgba(2,76,238,0.18)' }}
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