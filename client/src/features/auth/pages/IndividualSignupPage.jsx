import React, { useState } from "react";
import SignupLayout from "../components/SignupLayout";
import BasicInfoForm from "../components/BasicInfoForm";
import AdditionalInfo from "../components/AdditionalInfo";
import EmailVerification from "../components/EmailVerification";
import { useSignup } from "../hooks/useSignup";
import {
  signUpClient,
  verifyAccountConfirmResponse,
  resendVerificationEmail,
} from "../../../api/authService";
import { getErrorMessage } from "../../../api/errorMessages";

const IndividualSignupPage = () => {
  const {
    currentStep,
    setCurrentStep,
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
  } = useSignup(1);

  const [formData, setFormData] = useState(null);

  // --- Helper: Data Extraction ---
  const getValue = (source, key) => {
    if (source instanceof FormData) return source.get(key);
    return source?.[key];
  };

  // --- Core Submission Logic ---
  const handleSignUpSubmit = async (additionalData = {}) => {
    if (!formData) {
      setError("Please complete the previous step first.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();

      // 1. Map base data (Step 1)
      const keys =
        formData instanceof FormData
          ? Array.from(formData.keys())
          : Object.keys(formData);

      keys.forEach((key) => {
        if (key !== "profileImage") {
          fd.append(key, getValue(formData, key));
        }
      });

      // 2. Handle Profile Image (Google URL check)
      const profileImage = getValue(formData, "profileImage");
      if (typeof profileImage === "string" && profileImage.startsWith("http")) {
        fd.append("profileImageUrl", profileImage);
      }

      // 3. Handle Additional Info (Step 2)
      if (additionalData.profileImage) {
        const pImg = Array.isArray(additionalData.profileImage)
          ? additionalData.profileImage[0]
          : additionalData.profileImage;

        if (pImg instanceof File) {
          fd.delete("profileImageUrl"); // New file replaces Google URL
          fd.append("profileImage", pImg);
        } else if (typeof pImg === "string" && !pImg.startsWith("http")) {
          fd.append("profileImageUrl", pImg);
        }
      }

      if (additionalData.idDocument) {
        fd.append("idDocument", additionalData.idDocument);
      }

      fd.append("role", "individual");
      fd.append("subRole", "");

      // Capture email for verification step
      const userEmail = fd.get("email");
      setEmail(userEmail);

      const result = await signUpClient(fd);
      if (result) {
        setCurrentStep(3);
        startResendCooldown(180);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (code) => {
    try {
      await verifyAccountConfirmResponse({ token: code, email });
      navigate("/");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendVerificationEmail(email);
      startResendCooldown(180);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getSidebarStep = () => {
    if (currentStep === 1) return 2; // Basic Info
    if (currentStep === 2) return 3; // Additional Info
    return 4; // Verification
  };

  return (
    <SignupLayout
      currentSidebarStep={getSidebarStep()}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {currentStep === 1 && (
        <BasicInfoForm
          role="individual"
          onBack={() => navigate("/signup")}
          onContinue={(data) => {
            setFormData(data);
            setCurrentStep(2);
          }}
          error={error}
          setError={setError}
          initialValues={
            formData instanceof FormData
              ? Object.fromEntries(formData.entries())
              : formData
          }
        />
      )}

      {currentStep === 2 && (
        <AdditionalInfo
          role="individual"
          onBack={() => setCurrentStep(1)}
          onSkip={() => handleSignUpSubmit()}
          onComplete={(data) => handleSignUpSubmit(data)}
          initialProfileImage={getValue(formData, "profileImage")}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {currentStep === 3 && (
        <EmailVerification
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          error={error}
          setError={setError}
          cooldown={resendCooldown}
        />
      )}
    </SignupLayout>
  );
};

export default IndividualSignupPage;
