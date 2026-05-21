import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { BadgeProvider } from "../../contexts/BadgeContext";
import { Menu } from "lucide-react"; // Imported the menu icon
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();
  const location = useLocation();

  // Pick navigation lists based on security credentials
  let navItems = navConfigs[profile?.role] || clientNav;
  if (navItems && !Array.isArray(navItems) && typeof navItems === "object") {
    navItems =
      navItems.navItems || navItems.items || Object.values(navItems)[0];
  }

  // Handle auto-collapse sizing thresholds on mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, []);

  // Close mobile drawer view whenever URL paths change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <BadgeProvider>
      <div className="flex min-h-screen bg-white text-[#0a0f1e] font-['Outfit',sans-serif]">
        {/* Backdrop overlay for mobile drawer dismissals */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          />
        )}

        {/* Sidebar Frame Navigation Track */}
        <UpdatedDashboardSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          navItems={navItems}
          onToggleCollapse={toggleSidebar}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Primary Workspace Panel */}
        <main className="flex-1 min-w-0 bg-[#f7f9ff] flex flex-col min-h-screen">
          {/* MOBILE NAVIGATION BAR (Visible strictly below 768px viewports) */}

          <UpdatedDashboardTopbar
            onToggleSidebar={toggleSidebar}
            setMobileOpen={setMobileOpen}
          />

          <div className="p-4 md:p-6 lg:p-8 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </BadgeProvider>
  );
}
