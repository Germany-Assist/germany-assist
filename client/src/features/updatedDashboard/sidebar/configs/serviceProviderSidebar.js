import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  ShoppingBag,
  Briefcase,
  Calendar,
  Users,
  Wallet,
  UserCircle,
  ShieldCheck,
  Settings,
} from "lucide-react";

export const serviceProviderNav = [
  {
    section: "Overview",
    items: [
      { path: "/updated-dashboard/sp", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/updated-dashboard/sp/messages", icon: MessageSquare, label: "Messages", badgeKey: "messages", badgeColor: "nb-red" },
      { path: "/updated-dashboard/sp/notifications", icon: Bell, label: "Notifications", badgeKey: "notifications", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Work",
    items: [
      { path: "/updated-dashboard/sp/orders", icon: ShoppingBag, label: "Orders", badgeKey: "orders", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/sp/services", icon: Briefcase, label: "My Services" },
      { path: "/updated-dashboard/sp/events", icon: Calendar, label: "My Events" },
      { path: "/updated-dashboard/sp/clients", icon: Users, label: "Clients" },
    ],
  },
  {
    section: "Finance",
    items: [
      { path: "/updated-dashboard/sp/finance", icon: Wallet, label: "Finance" },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/sp/profile", icon: UserCircle, label: "Profile" },
      { path: "/updated-dashboard/sp/verification", icon: ShieldCheck, label: "Verification Centre", badgeKey: "verification", badgeColor: "nb-sky" },
      { path: "/updated-dashboard/sp/settings", icon: Settings, label: "Settings" },
    ],
  },
];