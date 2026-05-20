import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { BadgeProvider } from "../../contexts/BadgeContext";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 768,
  );
  const { profile } = useProfile();

  // 1. Find the correct config based on role
  let navItems = navConfigs[profile?.role] || clientNav;

  // 2. SAFEGUARD: If the configuration file wrapped the array inside an object property (e.g. { items: [...] })
  if (navItems && !Array.isArray(navItems) && typeof navItems === "object") {
    navItems =
      navItems.navItems || navItems.items || Object.values(navItems)[0];
  }

  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <BadgeProvider>
      <div className="flex min-h-screen bg-white text-[#0a0f1e] font-['Outfit',sans-serif]">
        {/* Sidebar Frame Navigation Track */}
        <UpdatedDashboardSidebar
          collapsed={sidebarCollapsed}
          navItems={navItems}
          onToggleCollapse={toggleCollapse}
        />

        {/* Primary Main Application Content Grid Space Workspace */}
        <main className="flex-1 min-w-0 bg-[#f7f9ff] flex flex-col">
          <UpdatedDashboardTopbar onToggleSidebar={toggleCollapse} />
          <div className="p-6 md:p-8 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </BadgeProvider>
  );
}
