import React from "react";
import SigninHeader from "../components/SigninHeader";
import SigninLeftPanel from "../components/SigninLeftPanel";
import SigninRightPanel from "../components/SigninRightPanel";

const SigninPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-[Outfit,sans-serif]">
      <SigninHeader />
      <div className="flex min-h-[calc(100vh-56px)]">
        <div className="hidden lg:flex w-[280px] flex-shrink-0">
          <SigninLeftPanel />
        </div>
        <SigninRightPanel />
      </div>
    </div>
  );
};

export default SigninPage;
