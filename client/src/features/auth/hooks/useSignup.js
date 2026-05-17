import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../api/errorMessages";

export const useSignup = (initialStep = 1) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Cooldown Timer ---
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    setError("");
  };

  const startResendCooldown = (seconds = 180) => {
    setResendCooldown(seconds);
  };

  return {
    currentStep,
    setCurrentStep: handleStepChange,
    email,
    setEmail,
    error,
    setError,
    sidebarOpen,
    setSidebarOpen,
    resendCooldown,
    startResendCooldown,
    isSubmitting,
    setIsSubmitting,
    navigate,
  };
};
