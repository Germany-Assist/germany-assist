import React, { useState, useEffect } from "react";
import SignupHeader from "../components/SignupHeader";
import SignupSidebar from "../components/SignupSidebar";
import RoleSelection from "../components/RoleSelection";
import BasicInfoForm from "../components/BasicInfoForm";
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

  const navigate = useNavigate();

  const handleStep1Complete = () => setCurrentStep(2);

  const handleStep2Complete = async (data) => {
    data.append("role", role);
    data.append("subRole", subRole);
    try {
      let result;
      if (role === "provider") {
        result =
          subRole === "company"
            ? await signUpCompany(data)
            : await signUpFreelancer(data);
      } else {
        result = await signUpClient(data);
      }
      if (result) {
        setError(null);
        setCurrentStep(3);
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
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <SignupHeader />

      {/* This wrapper fills the remaining height and prevents body scroll */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
        {/* Sidebar: h-full ensures it hits the bottom of the viewport */}
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 fixed lg:static z-40 w-[280px] h-full 
            bg-[#F9FAFB] border-r border-[#E5E7EB] px-6 py-9 
            transition-transform duration-300 ease-in-out
            flex flex-col flex-shrink-0 
          `}
        >
          <SignupSidebar currentStep={currentStep} />
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area: Independent scroll so the sidebar stays fixed */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="min-h-full flex flex-col items-center px-4 sm:px-10 py-12">
            <div className="w-full max-w-xl">
              {currentStep === 1 && (
                <RoleSelection
                  role={role}
                  subRole={subRole}
                  onRoleChange={setRole}
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

              {currentStep === 3 && (
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

        {/* Mobile Toggle */}
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
