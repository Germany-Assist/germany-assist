import React, { useMemo } from "react";
import { useProfile } from "../contexts/ProfileContext";
import DashboardSideBar from "../features/Dashboard/DashboardSideBar";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useActiveRoute, filterRoutesByRole } from "../utils/routeUtils";
import { routesConfig } from "../config/routesConfig";

export default function DashboardPage() {
  const { profile } = useProfile();
  const { label } = useActiveRoute();
  const role = profile?.role;

  // Derive dashboard-specific routes from the global config based on role
  const dashboardRoutes = useMemo(() => {
    const dashboardRoot = routesConfig.find((r) => r.path === "/dashboard");
    if (!dashboardRoot || !role) return [];
    return filterRoutesByRole(dashboardRoot.children, role);
  }, [role]);

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
      <DashboardSideBar navElements={dashboardRoutes} />

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col p-4 overflow-hidden">
        {/* Ambient Background Glows - Fixed to the viewport */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Dynamic Page Header */}
        <header className="relative z-20 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              {label}
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Dashboard / {label}
            </p>
          </div>
        </header>

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
