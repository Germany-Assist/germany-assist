import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UpdatedDashboardSidebar({
  navItems,
  collapsed,
  onToggleCollapse,
}) {
  const location = useLocation();
  const { profile } = useProfile();

  const getInitials = (name) => {
    if (!name) return "GA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role) => {
    const roles = {
      service_provider_root: "Service Provider",
      admin: "Admin",
      super_admin: "Super Admin",
      client: "Client",
    };
    return roles[role] || "User";
  };

  const isActive = (path) => {
    if (
      path === "/updated-dashboard/client" ||
      path === "/updated-dashboard/sp"
    ) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const badgeColorMap = {
    "nb-red": "bg-[#E53E3E]",
    "nb-blue": "bg-[#024CEE]",
    "nb-cyan": "bg-[#49B7DF]",
  };

  return (
    <div
      className={`
        sticky top-0 h-screen z-[100] flex flex-col bg-white border-r border-[#024CEE]/10 overflow-hidden transition-all duration-200 ease-in-out
        /* Base / Small Screens: Enforce absolute 56px widths so it cannot shrink to 0 */
        w-14 min-w-14 max-w-14
        /* Desktop Screens: Expand strictly based on state toggle */
        ${collapsed ? "md:w-14 md:min-w-14 md:max-w-14" : "md:w-[220px] md:min-w-[220px] md:max-w-[220px]"}
      `}
    >
      {/* Brand Header Logo Panel */}
      <div className="flex items-center justify-center md:justify-start border-b border-[#024CEE]/10 px-3 h-[65px] shrink-0 gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white border border-[#024CEE]/10">
          <div className="flex flex-col w-full h-full">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-[#d60d2e]" />
            <div className="flex-1 bg-[#f6ce17]" />
          </div>
        </div>

        {/* Text Area Description Panel */}
        <div
          className={`flex-col min-w-0 flex-1 ${collapsed ? "hidden" : "hidden md:flex"}`}
        >
          <span className="text-[13px] font-bold text-[#0a0f1e] leading-tight truncate">
            Germany Assists
          </span>
          <span className="text-[10px] text-gray-500 truncate">
            Provider Portal
          </span>
        </div>

        {/* Collapse Minimize Trigger Icon */}
        <button
          onClick={onToggleCollapse}
          className={`w-5.5 h-5.5 ml-auto rounded-md border border-[#024CEE]/10 bg-white items-center justify-center cursor-pointer shrink-0 text-gray-500 hover:bg-gray-50 transition-colors duration-150 ${collapsed ? "hidden" : "hidden md:flex"}`}
        >
          <ChevronLeft size={12} />
        </button>
      </div>

      {/* Expand Bar Segment Trigger (Only on collapsed desktop panels) */}
      {collapsed && (
        <div className="hidden md:flex justify-center py-2.5 bg-gray-50/30 border-b border-[#024CEE]/5 shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-5.5 h-5.5 rounded-md border border-[#024CEE]/10 bg-white flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Main Track Navigation List */}
      <nav className="flex-1 px-1.5 py-2.5 overflow-y-auto overflow-x-hidden space-y-1">
        {navItems?.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "pt-2" : ""}>
            <div
              className={`text-[9.5px] font-semibold tracking-wider text-gray-500 uppercase px-2 pb-1 whitespace-nowrap ${collapsed ? "hidden" : "hidden md:block"}`}
            >
              {section.section}
            </div>

            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const badgeBg = badgeColorMap[item.badgeColor] || "bg-[#49B7DF]";

              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  title={item.label}
                  className={`
                    flex items-center rounded-lg text-[13px] cursor-pointer transition-all duration-150 relative no-underline h-9
                    justify-center
                    ${collapsed ? "md:justify-center md:px-0" : "md:justify-start md:gap-2.5 md:px-2.5"}
                    ${active ? "text-[#024CEE] bg-[#024CEE]/7 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
                  `}
                >
                  <Icon size={15} className="shrink-0" />

                  <span
                    className={`flex-1 truncate ml-2.5 ${collapsed ? "hidden" : "hidden md:block"}`}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white ${badgeBg} ${collapsed ? "hidden" : "hidden md:block"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Base Account Dashboard Grid Footer */}
      <div className="p-1.5 border-t border-[#024CEE]/10 shrink-0 flex justify-center">
        <div
          onClick={() => {
            const base =
              profile?.role === "client"
                ? "/updated-dashboard/client"
                : "/updated-dashboard/sp";
            window.location.href = `${base}/profile`;
          }}
          className={`
            flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 w-full h-10 justify-center
            ${collapsed ? "md:justify-center md:p-0" : "md:justify-start md:gap-2.5 md:p-2"}
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-[#024CEE] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {getInitials(profile?.name)}
          </div>

          <div
            className={`flex-1 min-w-0 items-center justify-between ml-2.5 ${collapsed ? "hidden" : "hidden md:flex"}`}
          >
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold text-[#0a0f1e] truncate">
                {profile?.name || "Germany Assists"}
              </div>
              <div className="text-[10.5px] text-gray-500 truncate">
                {getRoleLabel(profile?.role)}
              </div>
            </div>
            <div className="text-gray-400 shrink-0 ml-2">
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
