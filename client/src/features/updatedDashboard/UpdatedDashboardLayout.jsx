import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import UpdatedDashboardSidebar from "./UpdatedDashboardSidebar";
import UpdatedDashboardTopbar from "./UpdatedDashboardTopbar";
import { serviceProviderNav } from "./sidebar/configs/serviceProviderSidebar";
import { clientNav } from "./sidebar/configs/clientSidebar";
import { adminNav } from "./sidebar/configs/adminSidebar";

const navConfigs = {
  service_provider_root: serviceProviderNav,
  client: clientNav,
  admin: adminNav,
  super_admin: adminNav,
};

export default function UpdatedDashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();

  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  const navItems = navConfigs[profile?.role] || clientNav;

  return (
    <div className="flex min-h-screen font-['Outfit',_sans-serif] bg-white text-[#0a0f1e]">
      {/* Sidebar - Always visible, handles its own collapse width */}
      <UpdatedDashboardSidebar
        navItems={navItems}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Framework Content Body */}
      <main className="flex-1 min-w-0 bg-[#f7f9ff] flex flex-col h-screen overflow-y-auto">
        {/* Pass down toggleCollapse to Topbar if you want a topbar burger button to collapse it too */}
        <UpdatedDashboardTopbar onToggleSidebar={toggleCollapse} />
        <div className="flex-1 p-[22px_24px_32px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
