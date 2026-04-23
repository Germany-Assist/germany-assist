import React from "react";
import SigninHeader from "../components/SigninHeader";
import SigninLeftPanel from "../components/SigninLeftPanel";
import SigninRightPanel from "../components/SigninRightPanel";

const SigninPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <SigninHeader />
      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        <SigninLeftPanel />
        <SigninRightPanel />
      </div>
    </div>
  );
};

export default SigninPage;