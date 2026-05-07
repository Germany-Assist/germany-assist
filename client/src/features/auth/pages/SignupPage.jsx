import React, { useState } from "react";
import SignupHeader from "../components/SignupHeader";
import SignupSidebar from "../components/SignupSidebar";
import QuickQuestions from "../components/QuickQuestions";
import BasicInfoForm from "../components/BasicInfoForm";
import SkipPage from "../components/SkipPage";
import AdditionalInfo from "../components/AdditionalInfo";
import EmailVerification from "../components/EmailVerification";
import {
  signUpClient,
  signUpFreelancer,
  signUpCompany,
  verifyAccountConfirmResponse,
  resendVerificationEmail,
} from "../../../api/authService";
import { getErrorMessage } from "../../../api/errorMessages";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState(null);
  const [subRole, setSubRole] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const navigate = useNavigate();

  const downloadImageAsFile = async (url) => {
    // Not used anymore - URL is sent directly to backend
    return null;
  };

  const triggerAnimation = () => {
    setAnimKey(prev => prev + 1);
  };

  const handleStep1Complete = () => {
    triggerAnimation();
    setCurrentStep(2);
  };

  const handleStep2Complete = (data) => {
    setBasicInfoData(data);
    triggerAnimation();
    setCurrentStep(2.5);
  };

  const handleSkipPage = async (additionalData = {}) => {
    if (!basicInfoData) {
      setError("Please complete the previous step first.");
      return;
    }
    
    const formData = new FormData();
    
    // Copy all fields from basicInfoData (skip profileImage, we'll handle it separately)
    for (const [key, value] of basicInfoData.entries()) {
      if (key !== "profileImage") {
        formData.append(key, value);
      }
    }
    
    // Check for Google profile image URL from BasicInfoForm
    const googleProfileImageUrl = basicInfoData.get("profileImage");
    const isGoogleImageUrl = googleProfileImageUrl && 
      typeof googleProfileImageUrl === "string" && 
      googleProfileImageUrl.startsWith("http");
    
    // If Google image URL exists, send it as separate field
    if (isGoogleImageUrl) {
      formData.append("profileImageUrl", googleProfileImageUrl);
    }
    
    formData.append("role", role);
    formData.append("subRole", subRole || "");
    
    if (additionalData.bio) {
      formData.append("bio", additionalData.bio);
    }
    
    // Handle uploaded profile image from AdditionalInfo (if skipping directly)
    if (additionalData.profileImage && !isGoogleImageUrl) {
      const profileImage = Array.isArray(additionalData.profileImage) 
        ? additionalData.profileImage[0] 
        : additionalData.profileImage;
      if (profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      } else if (typeof profileImage === "string" && !profileImage.startsWith("http")) {
        formData.append("profileImageUrl", profileImage);
      }
    }
    
    setEmail(formData.get("email"));
    
    try {
      let result;
      if (role === "provider" || role === "service") {
        result = subRole === "company" 
          ? await signUpCompany(formData) 
          : await signUpFreelancer(formData);
      } else {
        result = await signUpClient(formData);
      }
      if (result) {
        setError(null);
        setCurrentStep(4);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAdditionalInfo = () => {
    triggerAnimation();
    setCurrentStep(3);
  };

  const handleAdditionalInfoComplete = async (additionalData) => {
    if (!basicInfoData) return;
    
    const formData = new FormData();
    
    // Check for Google profile image URL from BasicInfoForm
    const googleProfileImageUrl = basicInfoData.get("profileImage");
    const isGoogleImageUrl = googleProfileImageUrl && 
      typeof googleProfileImageUrl === "string" && 
      googleProfileImageUrl.startsWith("http");
    
    // Copy all fields from basicInfoData (skip profileImage, we'll handle it separately)
    for (const [key, value] of basicInfoData.entries()) {
      if (key !== "profileImage") {
        formData.append(key, value);
      }
    }
    
    // If Google image URL exists, send it as separate field
    if (isGoogleImageUrl) {
      formData.append("profileImageUrl", googleProfileImageUrl);
    }
    
    // Handle uploaded profile image (from AdditionalInfo)
    if (additionalData.profileImage) {
      const profileImage = Array.isArray(additionalData.profileImage) 
        ? additionalData.profileImage[0] 
        : additionalData.profileImage;
      // Only append if it's a File, not a URL
      if (profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      } else if (typeof profileImage === "string" && !profileImage.startsWith("http")) {
        // It's a URL from our server, pass as profileImageUrl
        formData.append("profileImageUrl", profileImage);
      }
    }
    if (additionalData.idDocument) {
      formData.append("idDocument", additionalData.idDocument);
    }
    if (additionalData.proofOfResidence) {
      formData.append("proofOfResidence", additionalData.proofOfResidence);
    }
    if (additionalData.businessRegistration) {
      formData.append("businessRegistration", additionalData.businessRegistration);
    }
    
    formData.append("role", role);
    formData.append("subRole", subRole || "");
    if (additionalData.bio) {
      formData.append("bio", additionalData.bio);
    }
    
    if (additionalData.categories && additionalData.categories.length > 0) {
      formData.append("categories", JSON.stringify(additionalData.categories));
      
      // Build category entries mapping file indices to categories
      const categoryEntries = [];
      let fileIndex = 0;
      
      if (additionalData.categoryUploads) {
        Object.keys(additionalData.categoryUploads).forEach((catId) => {
          const files = additionalData.categoryUploads[catId];
          if (files) {
            const fileArray = Array.isArray(files) ? files : [files];
            const startIndex = fileIndex;
            fileArray.forEach((file) => {
              formData.append("categoryFiles", file);
              fileIndex++;
            });
            categoryEntries.push({ categoryId: catId, fileIndices: Array.from({ length: fileArray.length }, (_, i) => startIndex + i) });
          }
        });
      }
      
      // Send category entries so backend knows which file indices belong to which category
      formData.append("categoryEntries", JSON.stringify(categoryEntries));
    }
    
    setEmail(formData.get("email"));
    
    try {
      let result;
      if (role === "provider" || role === "service") {
        result = subRole === "company" 
          ? await signUpCompany(formData) 
          : await signUpFreelancer(formData);
      } else {
        result = await signUpClient(formData);
      }
      if (result) {
        setError(null);
        setCurrentStep(4);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleVerify = async (code) => {
    try {
      const res = await verifyAccountConfirmResponse({ token: code, email });
      if (res) {
        setError(null);
        navigate("/");
      }
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      const res = await resendVerificationEmail(email);
      if (res) {
        setError(null);
      }
    } catch (err) {
      setError("Failed to resend verification email. Please try again.");
    }
  };

  const handleBack = (formData = null) => {
    if (currentStep === 3) return;
    if (currentStep > 1) {
      // If going back from step 2, preserve form data
      if (currentStep === 2 && formData) {
        const newFormData = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            newFormData.append(key, formData[key]);
          }
        });
        setBasicInfoData(newFormData);
      }
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const getSidebarStep = () => {
    if (currentStep === 1) return 1;
    if (currentStep === 2) return 2;
    if (currentStep === 2.5 || currentStep === 3) return 3;
    return 4;
  };

  return (
    <div className="flex flex-col h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <SignupHeader />

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 fixed lg:static z-40 w-[280px] h-full 
            bg-[#F9FAFB] border-r border-[#E5E7EB] px-6 py-9 
            transition-transform duration-300 ease-in-out
            flex flex-col flex-shrink-0 
          `}
        >
          <SignupSidebar currentStep={getSidebarStep()} />
        </aside>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-white">
          <div className="min-h-full flex flex-col items-center px-4 sm:px-10 py-12">
            <div className="w-full max-w-xl">
              {currentStep === 1 && (
                <QuickQuestions
                  role={role}
                  subRole={subRole}
                  onRoleChange={(r) => {
                    setRole(r);
                    if (r === "service") {
                      setRole("provider");
                    } else if (r === "work") {
                      setRole("individual");
                    } else if (r === "relocate") {
                      setRole("relocate");
                    }
                  }}
                  onSubRoleChange={setSubRole}
                  onContinue={handleStep1Complete}
                />
              )}

              {currentStep === 2 && (
                <BasicInfoForm
                  role={role}
                  subRole={subRole}
                  onBack={handleBack}
                  onContinue={handleStep2Complete}
                  error={error}
                  setError={setError}
                  initialValues={basicInfoData ? Object.fromEntries(basicInfoData.entries()) : null}
                />
              )}

              {currentStep === 2.5 && (
                <SkipPage
                  onBack={() => setCurrentStep(2)}
                  onAddDetails={handleAdditionalInfo}
                  onSkip={handleSkipPage}
                />
              )}

              {(currentStep === 3) && (
                <AdditionalInfo
                  role={role}
                  subRole={subRole}
                  onBack={() => setCurrentStep(2.5)}
                  onSkip={handleSkipPage}
                  onComplete={handleAdditionalInfoComplete}
                  initialProfileImage={basicInfoData?.get("profileImage")}
                />
              )}

              {currentStep === 4 && (
                <EmailVerification
                  email={email}
                  onVerify={handleVerify}
                  onResend={() => handleResendVerificationEmail()}
                  onBack={handleBack}
                  error={error}
                  setError={setError}
                />
              )}
            </div>
          </div>
        </main>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#024CEE] text-white rounded-full shadow-xl flex items-center justify-center"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
};

export default SignupPage;