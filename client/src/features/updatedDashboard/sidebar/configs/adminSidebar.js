import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Wallet,
  UserCircle,
  ShieldCheck,
  Settings,
  Bell,
} from "lucide-react";

export const adminNav = [
  {
    section: "Overview",
    items: [
      { path: "/updated-dashboard/admin", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/updated-dashboard/admin/notifications", icon: Bell, label: "Notifications", badgeKey: "notifications", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Management",
    items: [
      { path: "/updated-dashboard/admin/users", icon: Users, label: "Users" },
      { path: "/updated-dashboard/admin/providers", icon: Briefcase, label: "Service Providers", badgeKey: "providers", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/admin/orders", icon: ShoppingBag, label: "Orders", badgeKey: "orders", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/admin/finance", icon: Wallet, label: "Finance" },
      { path: "/updated-dashboard/admin/verification", icon: ShieldCheck, label: "Verification", badgeKey: "verification", badgeColor: "nb-sky" },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/admin/profile", icon: UserCircle, label: "Profile" },
      { path: "/updated-dashboard/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];