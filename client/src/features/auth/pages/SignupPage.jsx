import React from "react";
import SignupLayout from "../components/SignupLayout";
import QuickQuestions from "../components/QuickQuestions";
import { useSignup } from "../hooks/useSignup";

const SignupPage = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
  } = useSignup(1);

  return (
    <SignupLayout
      currentSidebarStep={1}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <QuickQuestions />
    </SignupLayout>
  );
};

export default SignupPage;
