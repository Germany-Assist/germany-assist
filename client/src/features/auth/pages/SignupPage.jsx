import React, { useState } from "react";
import SignupHeader from "../components/SignupHeader";
import SignupSidebar from "../components/SignupSidebar";
import RoleSelection from "../components/RoleSelection";
import BasicInfoForm from "../components/BasicInfoForm";
import AdditionalInfoForm from "../components/AdditionalInfoForm";
import EmailVerification from "../components/EmailVerification";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState(null);
  const [subRole, setSubRole] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [skipAdditional, setSkipAdditional] = useState(false);

  const handleStep1Complete = ({ role: r, subRole: sr }) => {
    setRole(r);
    setSubRole(sr);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data) => {
    setEmail(data.email);
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    setCurrentStep(4);
  };

  const handleStep3Skip = () => {
    setSkipAdditional(true);
    setCurrentStep(4);
  };

  const handleVerify = (code) => {
    if (code === "12345") {
      alert("Account created successfully!");
    } else {
      setError("Invalid verification code. Use 12345 for demo.");
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
            />
          )}
          
          {currentStep === 3 && skipAdditional && (
            <div className="w-full max-w-[560px]">
              <button onClick={handleBack} className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4.5">← Back</button>
              <div className="text-xl font-bold text-[#111827] mb-1">Almost there! 🎉</div>
              <div className="text-sm text-[#6B7280] mb-4.5">Your basic account is ready. Would you like to add location and documents now?</div>
              <div className="border border-[#E5E7EB] rounded-xl p-5.5 mb-4.5 text-center">
                <div className="text-3xl mb-2.5">📋</div>
                <div className="text-base font-semibold text-[#111827] mb-1.25">Add Profile Details</div>
                <div className="text-sm text-[#6B7280] mb-4 leading-relaxed">Adding your location and documents helps verify your account faster. It only takes 2 minutes.</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setSkipAdditional(false); setCurrentStep(3); }} className="w-full py-2.75 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc]">Yes, add details →</button>
                  <button onClick={handleStep3Skip} className="w-full py-2.75 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7]">Skip for now — verify my email</button>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <EmailVerification 
              email={email}
              onVerify={handleVerify}
              onResend={() => alert("Code resent!")}
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