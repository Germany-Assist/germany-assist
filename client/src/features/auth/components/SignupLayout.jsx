import React from "react";
import SignupHeader from "./SignupHeader";
import SignupSidebar from "./SignupSidebar";

const SignupLayout = ({ currentSidebarStep, children, sidebarOpen, setSidebarOpen }) => {
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
          <SignupSidebar currentStep={currentSidebarStep} />
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
              {children}
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

export default SignupLayout;
