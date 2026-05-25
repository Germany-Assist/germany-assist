import React, { useState } from "react";
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
import { useSearchParams } from "react-router-dom";

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

  const getValue = (source, key) => {
    if (source instanceof FormData) return source.get(key);
    return source?.[key];
  };

  const getSidebarStep = () => {
    if (currentStep === 1) return 2;
    if (currentStep === 2) return 2.5;
    if (currentStep === 3) return 3;
    return 4;
  };

  const submitProviderSignup = async (additionalData = {}) => {
    if (!basicInfoData) return setError("Please complete basic info first.");

    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();

      const keys =
        basicInfoData instanceof FormData
          ? Array.from(basicInfoData.keys())
          : Object.keys(basicInfoData);

      keys.forEach((key) => {
        if (key !== "profileImage")
          fd.append(key, getValue(basicInfoData, key));
      });

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

      if (additionalData.about) fd.append("about", additionalData.about);

      // Handle Dynamic Identity Files
      if (additionalData.identityUploads) {
        const identityEntries = [];
        let idFileIndex = 0;

        Object.keys(additionalData.identityUploads).forEach((typeId) => {
          const file = additionalData.identityUploads[typeId];
          if (file instanceof File) {
            fd.append("identityFiles", file);
            identityEntries.push({
              identityTypeId: typeId,
              fileIndices: [idFileIndex],
            });
            idFileIndex++;
          }
        });

        if (identityEntries.length > 0) {
          fd.append("identityEntries", JSON.stringify(identityEntries));
        }
      }

      // Handle Dynamic Category Files
      if (additionalData.categories?.length > 0) {
        fd.append("categories", JSON.stringify(additionalData.categories));

        const categoryEntries = [];
        let catFileIndex = 0;

        if (additionalData.categoryUploads) {
          Object.keys(additionalData.categoryUploads).forEach((catId) => {
            const files = additionalData.categoryUploads[catId];
            const fileArray = Array.isArray(files) ? files : [files];
            const startIndex = catFileIndex;

            fileArray.forEach((file) => {
              if (file instanceof File) {
                fd.append("categoryFiles", file);
                catFileIndex++;
              }
            });

            if (catFileIndex > startIndex) {
              categoryEntries.push({
                categoryId: catId,
                fileIndices: Array.from(
                  { length: catFileIndex - startIndex },
                  (_, i) => startIndex + i,
                ),
              });
            }
          });
        }
        if (categoryEntries.length > 0) {
          fd.append("categoryEntries", JSON.stringify(categoryEntries));
        }
      }

      fd.append("role", "provider");
      fd.append("subRole", subRole || "");
      setEmail(fd.get("email"));
      const result =
        subRole === "company"
          ? await signUpCompany(fd)
          : await signUpFreelancer(fd);

      //flag delete this to stop the skip
      return;

      if (result && result.success == "true") {
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

      {currentStep === 2 && (
        <div className="w-full max-w-[560px] px-4 sm:px-0">
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
                onClick={() => submitProviderSignup()}
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
          role="provider"
          subRole={subRole}
          onBack={() => setCurrentStep(2)}
          onSkip={() => submitProviderSignup()}
          onComplete={(data) => submitProviderSignup(data)}
          initialProfileImage={getValue(basicInfoData, "profileImage")}
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

export default ProviderSignupPage;
