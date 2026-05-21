import React from "react";
import { NavLink } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { useBadges } from "../../contexts/BadgeContext";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const badgeColorMap = {
  "nb-red": "bg-red-500",
  "nb-blue": "bg-blue-600",
  "nb-sky": "bg-sky-400",
};

export default function UpdatedDashboardSidebar({
  navItems,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) {
  const { profile } = useProfile();
  const { getCount } = useBadges();

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
    const currentPath = window.location.pathname;
    if (
      path === "/updated-dashboard/sp" ||
      path === "/dashboard" ||
      path === "/"
    ) {
      return currentPath === path;
    }
    const base = path.replace(/\/[^/]+$/, "");
    if (path === base || base === "") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside
      className={`
        /* Layout Fixes: Fixed full-height sliding frame on mobile, structural track on desktop */
        fixed md:sticky top-0 bottom-0 h-screen bg-white border-r border-blue-100 flex flex-col shrink-0 transition-all duration-200 ease-in-out z-50
        
        /* Mobile Position States */
        ${mobileOpen ? "left-0 w-[240px]" : "-left-full md:left-0"}
        
        /* Desktop Width System states */
        ${collapsed ? "md:w-14 md:min-w-14 md:max-w-14" : "md:w-[220px] md:min-w-[220px] md:max-w-[220px]"}
      `}
    >
      {/* Brand Header Logo Panel */}
      <div
        className={`flex items-center gap-2 px-3.5 py-4 border-b border-blue-100 ${
          collapsed ? "md:justify-center" : "justify-start"
        }`}
      >
        {/* Mobile View: Shows Menu icon instead of flag layout panels */}
        <div className="flex md:hidden items-center justify-between w-full">
          <span className="text-[14px] font-bold text-gray-950">
            Germany Assists
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-50 border border-blue-50 bg-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Desktop View Brand Layout Assets */}
        <div
          className={`hidden md:flex items-center gap-2 w-full ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-lg border border-blue-100 overflow-hidden shrink-0 flex flex-col">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-yellow-400" />
          </div>

          <div className={`flex flex-col ${collapsed ? "md:hidden" : "flex"}`}>
            <span className="text-[13px] font-bold text-gray-950 leading-tight whitespace-nowrap">
              Germany Assists
            </span>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              {getRoleLabel(profile?.role)}
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            className={`
              w-5.5 h-5.5 rounded-md border border-blue-100 bg-white flex items-center justify-center shrink-0 text-gray-500 hover:bg-gray-50 transition-colors
              ${collapsed ? "hidden" : "ml-auto"}
            `}
          >
            <ChevronLeft size={12} />
          </button>
        </div>
      </div>

      {/* Expand Bar Segment Trigger Button (Desktop Track Compact Mode Only) */}
      {collapsed && (
        <div className="hidden md:flex justify-center py-2 bg-gray-50/50 border-b border-blue-50 shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-5.5 h-5.5 rounded-md border border-blue-100 bg-white flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Main Navigation Track Link List */}
      <nav className="flex-1 px-2 md:px-2 py-2.5 overflow-y-auto overflow-x-hidden text-left">
        {navItems?.map((section, idx) => (
          <div key={idx} className={""}>
            <div
              className={`text-[0.7rem]  font-semibold  tracking-wide text-gray-500 uppercase  pb-1  mt-1 whitespace-nowrap ${
                collapsed ? "md:hidden" : "block"
              }`}
            >
              {section.section}
            </div>
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const count = item.badgeKey ? getCount(item.badgeKey) : 0;
              const badgeBg = badgeColorMap[item.badgeColor] || "bg-sky-400";

              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  title={item.label}
                  className={`
                    flex items-center gap-3 rounded-lg text-xs md:text-[0.7rem] transition-all p-1 duration-150 mb-0.2 no-underline h-8 md:h-9
                    ${collapsed ? "md:justify-center md:px-0 relative" : "justify-start gap-2.5 px-2.5"}
                    ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:bg-gray-50"}
                  `}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className="shrink-0" size={18} />

                    {/* Collapsed Badge View Dot tracking tracker */}
                    {collapsed && item.badgeKey && count > 0 && (
                      <span
                        className={`
                          absolute -top-1.5 -right-2.5 hidden md:flex items-center justify-center
                          text-[8px] font-bold rounded-full text-white shrink-0 min-w-[18px] h-[18px] px-1
                          ${badgeBg} border border-white
                        `}
                      >
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </div>

                  <span
                    className={`flex-1 truncate ${collapsed ? "md:hidden" : "block"}`}
                  >
                    {item.label}
                  </span>

                  {/* Desktop Dynamic Counts / Mobile Counts Badge fallback list item */}
                  {item.badgeKey && count > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white shrink-0 ml-auto ${badgeBg} ${
                        collapsed ? "md:hidden" : "block"
                      }`}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Base Profile Footer Session Section */}
      <div className="px-2 py-2.5 border-t border-blue-100 shrink-0">
        <NavLink
          to={`${
            profile?.role === "client"
              ? "/updated-dashboard/client"
              : profile?.role === "admin" || profile?.role === "super_admin"
                ? "/updated-dashboard/admin"
                : "/updated-dashboard/sp"
          }/profile`}
          className={`
            flex items-center rounded-lg transition-colors hover:bg-gray-50 no-underline h-12
            ${collapsed ? "md:justify-center md:p-0" : "justify-start gap-2 p-2"}
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {getInitials(profile?.name)}
          </div>

          <div
            className={`flex-1 min-w-0 items-center justify-between ${collapsed ? "md:hidden" : "flex"}`}
          >
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold text-gray-950 truncate">
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
        </NavLink>
      </div>
    </aside>
  );
}
