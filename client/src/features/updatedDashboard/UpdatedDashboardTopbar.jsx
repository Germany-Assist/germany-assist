import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, MessageSquare, HelpCircle, Menu } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";

const pageTitles = {
  "/updated-dashboard": "Dashboard",
  "/updated-dashboard/messages": "Messages",
  "/updated-dashboard/notifications": "Notifications",
  "/updated-dashboard/orders": "Orders",
  "/updated-dashboard/services": "My Services",
  "/updated-dashboard/events": "My Events",
  "/updated-dashboard/clients": "Clients",
  "/updated-dashboard/finance": "Finance",
  "/updated-dashboard/profile": "Profile",
  "/updated-dashboard/verification": "Verification Centre",
  "/updated-dashboard/settings": "Settings",
  "/updated-dashboard/guide": "Guide",
};

export default function UpdatedDashboardTopbar({ onToggleSidebar }) {
  const location = useLocation();
  const { profile } = useProfile();

  const getInitials = (name) => {
    if (!name) return "GA";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="topbar" style={{
      background: "#fff",
      borderBottom: "1px solid rgba(2,76,238,0.10)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      height: "52px",
      position: "sticky",
      top: 0,
      zIndex: 20
    }}>
      {/* Mobile Hamburger */}
      <button 
        className="ham"
        onClick={onToggleSidebar}
        style={{
          display: "none",
          width: "32px", height: "32px", border: "1px solid rgba(2,76,238,0.10)", 
          borderRadius: "8px", background: "#fff", alignItems: "center", 
          justifyContent: "center", cursor: "pointer", marginRight: "4px"
        }}
      >
        <Menu size={14} />
      </button>

      {/* Page Title */}
      <div className="tb-title" style={{ fontSize: "14px", fontWeight: 600, color: "#0a0f1e" }}>
        {title}
      </div>

      {/* Right Side */}
      <div className="tb-right" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Notifications */}
        <button 
          className="tb-icon-btn"
          style={{
            width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(2,76,238,0.10)", 
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
            cursor: "pointer", color: "#6b7280", transition: "all 0.13s", position: "relative"
          }}
        >
          <Bell size={14} />
          <span style={{ position: "absolute", top: "5px", right: "5px", width: "7px", height: "7px", borderRadius: "50%", background: "#E53E3E", border: "1.5px solid #fff" }}></span>
        </button>

        {/* Messages */}
        <button 
          className="tb-icon-btn"
          style={{
            width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(2,76,238,0.10)", 
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
            cursor: "pointer", color: "#6b7280", transition: "all 0.13s"
          }}
        >
          <MessageSquare size={14} />
        </button>

        {/* Help */}
        <button 
          title="Help & Guide"
          style={{
            width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(2,76,238,0.20)", 
            background: "rgba(2,76,238,0.07)", display: "flex", alignItems: "center", justifyContent: "center", 
            cursor: "pointer", color: "#024CEE", transition: "all 0.13s"
          }}
        >
          <HelpCircle size={15} />
        </button>

        {/* Profile Avatar */}
        <div 
          style={{
            width: "32px", height: "32px", borderRadius: "8px", background: "#024CEE", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer"
          }}
        >
          {getInitials(profile?.name)}
        </div>
      </div>
    </header>
  );
}