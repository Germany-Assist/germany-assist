import React, { useState } from "react";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { FiGrid, FiLogOut, FiHome, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import ThemeSwitch from "../../components/ui/ThemeSwitch";
import { NavLink,useLocation } from "react-router-dom";


export default function DashboardSideBar({
  navElements,
}) {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { profile } = useProfile();
  const location = useLocation();
  const toggleMenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  
  return (
    <div className="p-4 h-screen bg-light-50 dark:bg-black transition-colors duration-500">
      {/* Main Container with your requested styling */}
      <div className="relative h-full w-72 flex flex-col rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
        {/* THE COOL COLOR LAYER: Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/10 blur-[100px]" />
        </div>

        {/* Sidebar Header */}
        <div className="relative z-10 p-8 flex flex-col items-center border-b border-zinc-100 dark:border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <ProfileAvatar
              navDir={"/"}
              className="relative w-20 h-20 ring-4 ring-white dark:ring-zinc-800 rounded-full object-cover shadow-2xl"
              showBadge={true}
            />
          </div>
          <span className="mt-4 text-[10px] uppercase tracking-[0.4em] font-black text-blue-600 dark:text-blue-400">
            {profile.role || "Member"}
          </span>
          <div className="mt-4 bg-zinc-100 dark:bg-white/5 p-1 rounded-full scale-90">
            <ThemeSwitch />
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navElements.map((item, index) => {
            const hasChildren = item.children?.length > 0;

            const basePath = item.path? `/dashboard/${item.path}`: "/dashboard";

            const isExpanded =
              expandedMenus[item.label] ||
              location.pathname.startsWith(basePath); 

            const isActive = item.path === ""
          ? location.pathname === "/dashboard"
          : location.pathname.startsWith(basePath);

            return (
              <div key={index} className="space-y-1">
                
                {/*  Parent */}
                <div
                  onClick={() => hasChildren && toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group cursor-pointer
                    ${
                      isActive
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-black/10 scale-[1.02]"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                >
                  <NavLink to={basePath} className="flex items-center gap-3 w-full">
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </NavLink>

                  {hasChildren && (
                    <FiChevronDown
                      className={`cursor-pointer transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/*  Children */}
                {hasChildren && isExpanded && (
                  <div className="ml-9 border-l border-zinc-200 dark:border-white/10 space-y-1 mt-1">
                    {item.children.map((child, idx) => {
                      const childPath = `${basePath}/${child.path}`; // ✅ مهم

                      const isChildActive = location.pathname.startsWith(childPath);

                      return (
                        <NavLink
                          key={idx}
                          to={childPath}
                          className={`block px-4 py-2 text-xs rounded-xl transition
                            ${
                              isChildActive
                                ? "text-blue-600"
                                : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            }`}
                        >
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="relative z-10 p-4 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 rounded-b-[2.5rem]">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <FiHome size={18} />
            <span>Main Home</span>
          </button>

          <button
            onClick={() => logOut(true)}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <FiLogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
