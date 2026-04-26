import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getErrorMessage } from "../../../api/errorMessages";
import { useNavigate } from "react-router-dom";
const SigninRightPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
  };

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
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex-1 flex items-center justify-center gap-2 py-2.75 border border-[#E5E7EB] rounded-xl bg-white text-sm font-medium text-[#111827] cursor-pointer transition-all hover:bg-[#F9FAFB] hover:border-[#93b4f7]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
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
