import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { 
  LayoutDashboard, MessageSquare, Bell, ShoppingBag, Briefcase, 
  Calendar, Users, Wallet, UserCircle, ShieldCheck, Settings, 
  BookOpen, ChevronLeft, ChevronRight, LogOut, Home
} from "lucide-react";

const navItems = [
  { section: "Overview", items: [
    { path: "/updated-dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { path: "/updated-dashboard/messages", icon: MessageSquare, label: "Messages", badge: "5", badgeColor: "nb-red" },
    { path: "/updated-dashboard/notifications", icon: Bell, label: "Notifications", badge: "3", badgeColor: "nb-red" },
  ]},
  { section: "Work", items: [
    { path: "/updated-dashboard/orders", icon: ShoppingBag, label: "Orders", badge: "14", badgeColor: "nb-blue" },
    { path: "/updated-dashboard/services", icon: Briefcase, label: "My Services", badge: null },
    { path: "/updated-dashboard/events", icon: Calendar, label: "My Events", badge: null },
    { path: "/updated-dashboard/clients", icon: Users, label: "Clients", badge: null },
  ]},
  { section: "Finance", items: [
    { path: "/updated-dashboard/finance", icon: Wallet, label: "Finance", badge: null },
  ]},
  { section: "Account", items: [
    { path: "/updated-dashboard/profile", icon: UserCircle, label: "Profile", badge: null },
    { path: "/updated-dashboard/verification", icon: ShieldCheck, label: "Verification Centre", badge: "!", badgeColor: "nb-sky" },
    { path: "/updated-dashboard/settings", icon: Settings, label: "Settings", badge: null },
  ]},
  { section: "Help", items: [
    { path: "/updated-dashboard/guide", icon: BookOpen, label: "Guide", badge: null },
  ]},
];

export default function UpdatedDashboardSidebar({ collapsed, open, onToggleCollapse, onCloseMobile }) {
  const location = useLocation();
  const { profile } = useProfile();

  const getInitials = (name) => {
    if (!name) return "GA";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role) => {
    const roles = {
      service_provider_root: "Service Provider",
      admin: "Admin",
      super_admin: "Super Admin",
      client: "Client"
    };
    return roles[role] || "User";
  };

  const isActive = (path) => location.pathname === path || (path !== "/updated-dashboard" && location.pathname.startsWith(path));

  return (
    <aside 
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}
      style={{
        width: collapsed ? "56px" : "220px",
        background: "#fff",
        borderRight: "1px solid rgba(2,76,238,0.10)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
        transition: "width 0.25s",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {/* Logo Area */}
      <div className="logo-area" style={{ padding: "16px 14px 14px", borderBottom: "1px solid rgba(2,76,238,0.10)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div className="ga-mark" style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#fff", border: "1px solid rgba(2,76,238,0.10)", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div style={{ flex: 1, background: "#000" }}></div>
            <div style={{ flex: 1, background: "#d60d2e" }}></div>
            <div style={{ flex: 1, background: "#f6ce17" }}></div>
          </div>
        </div>
        <div className="ga-logo-text" style={{ display: "flex", flexDirection: "column", transition: "opacity 0.2s" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0a0f1e", lineHeight: 1.1 }}>Germany Assists</span>
          <span style={{ fontSize: "10px", color: "#6b7280" }}>Provider Portal</span>
        </div>
        <button 
          onClick={onToggleCollapse}
          style={{
            width: "22px", height: "22px", borderRadius: "6px", border: "1px solid rgba(2,76,238,0.10)", 
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
            cursor: "pointer", flexShrink: 0, color: "#6b7280", transition: "background 0.13s", marginLeft: "auto"
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="nav" style={{ flex: 1, padding: "10px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((section, idx) => (
          <div key={idx}>
            <div className="nav-label" style={{ 
              fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.08em", 
              color: "#6b7280", textTransform: "uppercase", padding: "8px 8px 3px", whiteSpace: "nowrap" 
            }}>
              {section.section}
            </div>
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "8px 9px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: active ? "#024CEE" : "#6b7280",
                    cursor: "pointer",
                    transition: "all 0.13s",
                    marginBottom: "1px",
                    position: "relative",
                    whiteSpace: "nowrap",
                    background: active ? "rgba(2,76,238,0.07)" : "transparent",
                    textDecoration: "none"
                  }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <span className="nav-text" style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span className={`nb ${item.badgeColor}`} style={{
                      marginLeft: "auto", fontSize: "10px", fontWeight: 600, 
                      padding: "1px 6px", borderRadius: "20px", color: "#fff",
                      background: item.badgeColor === "nb-red" ? "#E53E3E" : item.badgeColor === "nb-blue" ? "#024CEE" : "#49B7DF"
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer - Profile */}
      <div className="sidebar-footer" style={{ padding: "10px 8px 14px", borderTop: "1px solid rgba(2,76,238,0.10)" }}>
        <div 
          className="sp-profile"
          onClick={() => window.location.href = '/updated-dashboard/profile'}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "9px",
            borderRadius: "9px",
            cursor: "pointer",
            transition: "background 0.13s"
          }}
        >
          <div className="s-av" style={{
            width: "32px", height: "32px", borderRadius: "8px", background: "#024CEE", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            color: "#fff", fontSize: "11px", fontWeight: 700, flexShrink: 0
          }}>
            {getInitials(profile?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sp-nm" style={{ fontSize: "12.5px", fontWeight: 600, color: "#0a0f1e", whiteSpace: "nowrap" }}>
              {profile?.name || "Germany Assists"}
            </div>
            <div className="sp-rl" style={{ fontSize: "10.5px", color: "#6b7280", whiteSpace: "nowrap" }}>
              {getRoleLabel(profile?.role)}
            </div>
          </div>
          <div className="pf-arrow" style={{ marginLeft: "auto", color: "#6b7280" }}>
            <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </aside>
  );
}