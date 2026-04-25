import React, { useState } from "react";
import SignupHeader from "../components/SignupHeader";
import SignupSidebar from "../components/SignupSidebar";
import RoleSelection from "../components/RoleSelection";
import BasicInfoForm from "../components/BasicInfoForm";
import AdditionalInfoForm from "../components/AdditionalInfoForm";
import EmailVerification from "../components/EmailVerification";
import {
  signUpRequest,
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
  const [skipAdditional, setSkipAdditional] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const handleStep1Complete = () => {
    setCurrentStep(2);
  };

  const handleStep2Complete = (data) => {
    setEmail(data.email);
    setData(data);
    setCurrentStep(3);
  };
  const handleRegisterClient = async (data) => {
    try {
      await signUpRequest(data);
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };
  const handleEmailVerification = async (code) => {
    try {
      await verifyAccountConfirmResponse({ token: code, email });
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };
  const handleResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail({ email });
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };
  const handleStep3Complete = async (extraData) => {
    const newData = { ...data, ...extraData };
    setData(newData);
    if (!role && !subRole) {
      const res = await handleRegisterClient(newData);
      if (res) {
        setError(null);
        setCurrentStep(4);
      }
    }
  };

  const handleStep3Skip = () => {
    // setSkipAdditional(true);
    // setCurrentStep(4);
  };

  const handleVerify = async (code) => {
    const res = await handleEmailVerification(code);
    if (res) {
      setError(null);
      navigate("/");
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <SignupHeader />

      <div className="flex min-h-[calc(100vh-65px)]">
        <SignupSidebar currentStep={currentStep} />

        <div className="flex-1 flex flex-col items-center px-5 py-9 overflow-y-auto">
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
          {currentStep === 3 && !skipAdditional && (
            <AdditionalInfoForm
              role={role}
              subRole={subRole}
              onBack={handleBack}
              onContinue={handleStep3Complete}
              onSkip={handleStep3Skip}
              setError={setError}
              error={error}
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
    </div>
  );
};

export default SignupPage;
