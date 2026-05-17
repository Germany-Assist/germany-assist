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

  const getValue = (source, key) => {
    if (source instanceof FormData) return source.get(key);
    return source?.[key];
  };

  const handleSignUpSubmit = async (additionalData = {}) => {
    if (!formData) {
      setError("Please complete the previous step first.");
      return;
    }
    console.log("additionalData", additionalData);
    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();

      const keys =
        formData instanceof FormData
          ? Array.from(formData.keys())
          : Object.keys(formData);

      keys.forEach((key) => {
        if (key !== "profileImage") {
          fd.append(key, getValue(formData, key));
        }
      });

      const profileImage = getValue(formData, "profileImage");
      if (typeof profileImage === "string" && profileImage.startsWith("http")) {
        fd.append("profileImageUrl", profileImage);
      }

      if (additionalData.profileImage) {
        const pImg = Array.isArray(additionalData.profileImage)
          ? additionalData.profileImage[0]
          : additionalData.profileImage;

        if (pImg instanceof File) {
          fd.delete("profileImageUrl");
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

      const userEmail = fd.get("email");
      setEmail(userEmail);

      const result = await signUpClient(fd);
      if (result) {
        setCurrentStep(4);
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
    if (currentStep === 1) return 2;
    if (currentStep === 2) return 2.5;
    if (currentStep === 3) return 3;
    return 4;
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
        <div className="w-full max-w-[560px] px-4 sm:px-0 text-left animate-fade-up">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center p-3 gap-1.5 bg-none border border-[#E5E7EB] text-[#6B7280] text-[0.79rem] py-1.5 px-2.75 rounded-lg cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4"
          >
            ← Back
          </button>
          <div className="text-[1.35rem] font-bold text-[#111827] mb-1">
            Almost there! 🎉
          </div>
          <div className="text-[0.83rem] text-[#6B7280] mb-5 leading-relaxed">
            Your basic account is ready. Would you like to add location and
            documents now?
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[13px] p-5 mb-4.5 text-center">
            <div className="text-[34px] mb-2.5">📋</div>
            <h3 className="text-[0.95rem] font-semibold text-[#111827] mb-1">
              Add Profile Details
            </h3>
            <p className="text-[0.8rem] text-[#6B7280] leading-relaxed mb-4">
              Adding your location and documents helps verify your account
              faster and unlocks all features. It only takes 2 minutes.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full py-3 rounded-[10px] bg-[#024CEE] text-white font-semibold text-[0.9rem] cursor-pointer transition-all hover:bg-[#0341cc] hover:-translate-y-0.5"
                style={{ boxShadow: "0 2px 10px rgba(2,76,238,0.18)" }}
              >
                Yes, add details →
              </button>
              <button
                onClick={() => handleSignUpSubmit()}
                className="w-full py-[11px] border border-[#E5E7EB] rounded-[10px] bg-white text-[#6B7280] text-[0.9rem] font-medium cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
              >
                Skip for now — verify my email
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <AdditionalInfo
          role="individual"
          onBack={() => setCurrentStep(2)}
          onSkip={() => handleSignUpSubmit()}
          onComplete={(data) => handleSignUpSubmit(data)}
          initialProfileImage={getValue(formData, "profileImage")}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {currentStep === 4 && (
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
