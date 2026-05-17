import React, { use, useState } from "react";
import SignupLayout from "../components/SignupLayout";
import BasicInfoForm from "../components/BasicInfoForm";
import AdditionalInfo from "../components/AdditionalInfo";
import EmailVerification from "../components/EmailVerification";
import { useSignup } from "../hooks/useSignup";
import {
  signUpFreelancer,
  signUpCompany,
  verifyAccountConfirmResponse,
  resendVerificationEmail,
} from "../../../api/authService";
import { getErrorMessage } from "../../../api/errorMessages";
import { useParams, useSearchParams } from "react-router-dom";

const ProviderSignupPage = () => {
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

  const [basicInfoData, setBasicInfoData] = useState(null);

  const [searchParams] = useSearchParams();
  const subRole = searchParams.get("subRole");

  // --- Helpers ---
  const getValue = (source, key) => {
    if (source instanceof FormData) return source.get(key);
    return source?.[key];
  };

  const getSidebarStep = () => {
    return currentStep;
  };

  // --- Core Submission ---
  const submitProviderSignup = async (additionalData = {}) => {
    if (!basicInfoData) return setError("Please complete basic info first.");

    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();

      // 1. Map Step 2 (Basic Info)
      const keys =
        basicInfoData instanceof FormData
          ? Array.from(basicInfoData.keys())
          : Object.keys(basicInfoData);

      keys.forEach((key) => {
        if (key !== "profileImage")
          fd.append(key, getValue(basicInfoData, key));
      });

      // 2. Handle Profile Image (Google URL vs File)
      const initialImg = getValue(basicInfoData, "profileImage");
      if (typeof initialImg === "string" && initialImg.startsWith("http")) {
        fd.append("profileImageUrl", initialImg);
      }

      if (additionalData.profileImage) {
        const pImg = Array.isArray(additionalData.profileImage)
          ? additionalData.profileImage[0]
          : additionalData.profileImage;
        if (pImg instanceof File) {
          fd.delete("profileImageUrl");
          fd.append("profileImage", pImg);
        }
      }

      // 3. Handle Step 3 (Additional Docs & Categories)
      [
        "idDocument",
        "proofOfResidence",
        "businessRegistration",
        "about",
      ].forEach((field) => {
        if (additionalData[field]) fd.append(field, additionalData[field]);
      });

      if (additionalData.categories?.length > 0) {
        fd.append("categories", JSON.stringify(additionalData.categories));

        const categoryEntries = [];
        let fileIndex = 0;

        if (additionalData.categoryUploads) {
          Object.keys(additionalData.categoryUploads).forEach((catId) => {
            const files = additionalData.categoryUploads[catId];
            const fileArray = Array.isArray(files) ? files : [files];
            const startIndex = fileIndex;

            fileArray.forEach((file) => {
              fd.append("categoryFiles", file);
              fileIndex++;
            });

            categoryEntries.push({
              categoryId: catId,
              fileIndices: Array.from(
                { length: fileArray.length },
                (_, i) => startIndex + i,
              ),
            });
          });
        }
        fd.append("categoryEntries", JSON.stringify(categoryEntries));
      }

      fd.append("role", "provider");
      fd.append("subRole", subRole || "");
      setEmail(fd.get("email"));

      const result =
        subRole === "company"
          ? await signUpCompany(fd)
          : await signUpFreelancer(fd);
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
    try {
      await resendVerificationEmail(email);
      startResendCooldown(180);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <SignupLayout
      currentSidebarStep={getSidebarStep()}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Step 2: Basic Info */}
      {currentStep === 1 && (
        <BasicInfoForm
          role="provider"
          subRole={subRole}
          onBack={() => navigate("/signup")}
          onContinue={(data) => {
            setBasicInfoData(data);
            setCurrentStep(2);
          }}
          error={error}
          setError={setError}
          initialValues={
            basicInfoData instanceof FormData
              ? Object.fromEntries(basicInfoData)
              : basicInfoData
          }
        />
      )}

      {/* Step 3: Additional Info */}
      {currentStep === 2 && (
        <AdditionalInfo
          role="provider"
          subRole={subRole}
          onBack={() => setCurrentStep(1)}
          onSkip={() => submitProviderSignup()}
          onComplete={(data) => submitProviderSignup(data)}
          initialProfileImage={getValue(basicInfoData, "profileImage")}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}

      {/* Step 4: Email Verification */}
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

export default ProviderSignupPage;
