import React, { useEffect, useState } from "react";
import { useProfile } from "../contexts/ProfileContext";
import DashboardSideBar from "../features/Dashboard/DashboardSideBar";
import DashboardMap from "../features/Dashboard/tabs/index";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardPage() {
  const { profile } = useProfile();
  const location = useLocation();
  const role = profile?.role;

  const getTitle = () => {
    const currentPath = location.pathname.replace("/dashboard/", "");
    const items = Object.values(DashboardMap[role]);

    for (const item of items) {
      // parent
      if (item.path === currentPath) {
        return item.label;
      }

      if (item.path === "" && currentPath === "") {
        return item.label;
      }

      // parent and children
      if (item.children) {
        for (const child of item.children) {
          const fullPath = `${item.path}/${child.path}`;

          if (currentPath === fullPath) {
            return child.label;
          }
        }
      }
    }
    return "General";
  };

  if (!profile?.role)
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="relative w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-700 overflow-hidden">
      {/* Sidebar - Floating Pod */}
      <DashboardSideBar
        navElements={Object.values(DashboardMap[profile.role])}
      />

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col p-4 overflow-hidden">
        {/* Ambient Background Glows - Fixed to the viewport */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />

        {/* The Main Glass Pod */}
        <main className="relative z-10 flex-1 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
