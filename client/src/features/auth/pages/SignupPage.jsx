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

  const navigate = useNavigate();

  const handleStep1Complete = () => setCurrentStep(2);

  const handleStep2Complete = (data) => {
    setBasicInfoData(data);
    setCurrentStep(2.5);
  };

  const handleSkipPage = async (additionalData = {}) => {
    if (!basicInfoData) {
      setError("Please complete the previous step first.");
      return;
    }
    
    const formData = new FormData();
    
    basicInfoData.forEach((value, key) => {
      formData.append(key, value);
    });
    
    formData.append("role", role);
    formData.append("subRole", subRole || "");
    
    if (additionalData.bio) {
      formData.append("bio", additionalData.bio);
    }
    
    if (additionalData.profileImage) {
      const profileImage = Array.isArray(additionalData.profileImage) 
        ? additionalData.profileImage[0] 
        : additionalData.profileImage;
      if (profileImage) formData.append("profileImage", profileImage);
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
    setCurrentStep(3);
  };

  const handleAdditionalInfoComplete = async (additionalData) => {
    if (!basicInfoData) return;
    
    const formData = new FormData();
    
    basicInfoData.forEach((value, key) => {
      formData.append(key, value);
    });
    
    if (additionalData.profileImage) {
      const profileImage = Array.isArray(additionalData.profileImage) 
        ? additionalData.profileImage[0] 
        : additionalData.profileImage;
      if (profileImage) formData.append("profileImage", profileImage);
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
      
      if (additionalData.categoryUploads) {
        Object.keys(additionalData.categoryUploads).forEach((catId) => {
          const files = additionalData.categoryUploads[catId];
          if (files) {
            const fileArray = Array.isArray(files) ? files : [files];
            fileArray.forEach((file, index) => {
              formData.append("categoryFiles", file);
            });
          }
        });
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

  const handleBack = () => {
    setError("");
    if (currentStep === 3) return;
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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