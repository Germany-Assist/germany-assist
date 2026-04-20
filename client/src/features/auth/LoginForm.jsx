import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SocialAuth from "./SocialAuth";

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:bg-white/10 transition-all duration-300";

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl italic">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600 ml-1">
          Identity
        </label>
        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
            Security
          </label>
          <button
            type="button"
            className="text-[10px] uppercase tracking-wider text-cyan-600 hover:text-cyan-400"
          >
            Forgot?
          </button>
        </div>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all active:scale-[0.98]"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <SocialAuth />

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-cyan-500 font-medium hover:underline"
        >
          Register free
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
