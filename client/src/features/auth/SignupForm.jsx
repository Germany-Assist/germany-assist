import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/errorMessages";
import SocialAuth from "./SocialAuth";

const SignupForm = ({ onSwitch }) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:bg-white/10 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl italic">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        onChange={handleChange}
        className={inputClass}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className={inputClass}
        required
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        className={inputClass}
        required
      />

      <div className="flex items-start px-1 pt-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-0"
        />
        <label
          htmlFor="terms"
          className="ml-3 text-xs text-gray-500 leading-tight"
        >
          I agree to the{" "}
          <span className="text-cyan-500 cursor-pointer">Terms</span> and{" "}
          <span className="text-cyan-500 cursor-pointer">Privacy Policy</span>.
        </label>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all active:scale-[0.98] mt-2"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>

      <SocialAuth mode="sign up" />

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-cyan-500 font-medium hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
