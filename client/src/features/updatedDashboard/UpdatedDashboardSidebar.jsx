import React from "react";
import { NavLink } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { useBadges } from "../../contexts/BadgeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const badgeColorMap = {
  "nb-red": "bg-red-500",
  "nb-blue": "bg-blue-600",
  "nb-sky": "bg-sky-400",
};

export default function UpdatedDashboardSidebar({
  navItems,
  collapsed,
  onToggleCollapse,
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
    const base = path.replace(/\/[^/]+$/, "");
    if (path === base || base === "") {
      return window.location.pathname === path;
    }
    return window.location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        /* Base structure: Locks it to full height, handles borders, backgrounds, and smooth tracking animations */
        flex flex-col border-r border-blue-100 bg-white h-screen shrink-0 transition-all duration-200 ease-in-out sticky top-0
        
        /* 
          FIX: Responsive layout widths driven strictly by state 
          This forces it to ALWAYS stay visible, dropping to a compact 56px size on mobile 
          regardless of layout states unless explicitly expanded.
        */
        ${collapsed ? "w-14 min-w-14 max-w-14" : "w-[220px] min-w-[220px] max-w-[220px]"}
      `}
    >
      {/* Brand Header Logo Panel */}
      <div
        className={`flex items-center gap-2 px-3.5 py-4 border-b border-blue-100 ${collapsed ? "justify-center" : "justify-start"}`}
      >
        <div className="w-8 h-8 rounded-lg border border-blue-100 overflow-hidden shrink-0 flex flex-col">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
        </div>

        <div className={`flex flex-col ${collapsed ? "hidden" : "flex"}`}>
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

      {/* Expand Bar Segment Trigger Button (Shows up explicitly when track is thin) */}
      {collapsed && (
        <div className="flex justify-center py-2 bg-gray-50/50 border-b border-blue-50 shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-5.5 h-5.5 rounded-md border border-blue-100 bg-white flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Main Navigation Track Link List */}
      <nav className="flex-1 px-2 py-2.5 overflow-y-auto overflow-x-hidden space-y-0.5">
        {navItems?.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "pt-2" : ""}>
            <div
              className={`text-[9.5px] font-semibold tracking-wide text-gray-500 uppercase px-2 pb-1 whitespace-nowrap ${collapsed ? "hidden" : "block"}`}
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
                    flex items-center rounded-lg text-[13px] transition-all duration-150 mb-0.5 no-underline h-9
                    ${collapsed ? "justify-center px-0" : "justify-start gap-2.5 px-2.5"}
                    ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:bg-gray-50"}
                  `}
                >
                  <Icon className="shrink-0" size={15} />
                  <span
                    className={`flex-1 truncate ${collapsed ? "hidden" : "block"}`}
                  >
                    {item.label}
                  </span>

                  {item.badgeKey && count > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white shrink-0 ${badgeBg} ${collapsed ? "hidden" : "ml-auto"}`}
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
            ${collapsed ? "justify-center p-0" : "justify-start gap-2 p-2"}
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {getInitials(profile?.name)}
          </div>

          <div
            className={`flex-1 min-w-0 items-center justify-between ${collapsed ? "hidden" : "flex"}`}
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
