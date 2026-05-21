import React from "react";
import { Bell, MessageSquare, HelpCircle, Menu } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";

export default function UpdatedDashboardTopbar({ onToggleSidebar, pageTitle }) {
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center bg-white px-4 border-b border-blue-200/50">
      {/* Mobile Hamburger Trigger */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-white text-gray-700 hover:bg-gray-50 transition-colors mr-2 shrink-0 cursor-pointer"
        aria-label="Open Navigation Menu"
      >
        <Menu size={18} />
      </button>

      {/* Page Title */}
      <h1 className="text-[14px] font-semibold text-[#0a0f1e] truncate">
        {pageTitle}
      </h1>

      {/* Right Action Icons Panel */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/40 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Bell size={14} />
          <span className="absolute top-[5px] right-[5px] h-1.5 w-1.5 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Messages */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/40 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <MessageSquare size={14} />
        </button>

        {/* Help & Guide */}
        <button
          type="button"
          title="Help & Guide"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/20 bg-blue-50/50 text-[#024CEE] hover:bg-blue-50 transition-all cursor-pointer"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
}
