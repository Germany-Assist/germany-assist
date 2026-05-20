import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Wallet,
  UserCircle,
  ShieldCheck,
  Settings,
  AlertCircle,
  Bell,
} from "lucide-react";

export const adminNav = [
  {
    section: "Overview",
    items: [
      { path: "/updated-dashboard/admin", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { path: "/updated-dashboard/admin/notifications", icon: Bell, label: "Notifications", badge: "5", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Management",
    items: [
      { path: "/updated-dashboard/admin/users", icon: Users, label: "Users", badge: null },
      { path: "/updated-dashboard/admin/providers", icon: Briefcase, label: "Service Providers", badge: "3", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/admin/orders", icon: ShoppingBag, label: "Orders", badge: null },
      { path: "/updated-dashboard/admin/finance", icon: Wallet, label: "Finance", badge: null },
      { path: "/updated-dashboard/admin/verification", icon: ShieldCheck, label: "Verification", badge: "2", badgeColor: "nb-sky" },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/admin/profile", icon: UserCircle, label: "Profile", badge: null },
      { path: "/updated-dashboard/admin/settings", icon: Settings, label: "Settings", badge: null },
    ],
  },
];