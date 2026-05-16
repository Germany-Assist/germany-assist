import React, { useState } from "react";
import UpdatedDashboardSidebar from "./UpdatedDashboardSidebar";
import UpdatedDashboardTopbar from "./UpdatedDashboardTopbar";
import { Outlet } from "react-router-dom";

export default function UpdatedDashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="shell" style={{ display: "flex", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", background: "#fff", color: "#0a0f1e" }}>
      {/* Mobile Overlay */}
      <div 
        className={`mob-overlay ${sidebarOpen ? 'show' : ''}`}
        style={{
          display: sidebarOpen ? 'block' : 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 99
        }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <UpdatedDashboardSidebar 
        collapsed={sidebarCollapsed}
        open={sidebarOpen}
        onToggleCollapse={toggleCollapse}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="main" style={{ flex: 1, overflow: "auto", background: "#f7f9ff", minWidth: 0 }}>
        <UpdatedDashboardTopbar onToggleSidebar={toggleSidebar} />
        <div className="content" style={{ padding: "22px 24px 32px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}