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
  BookOpen,
} from "lucide-react";

export const serviceProviderNav = [
  {
    section: "Overview",
    items: [
      { path: "/updated-dashboard/sp", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { path: "/updated-dashboard/sp/messages", icon: MessageSquare, label: "Messages", badge: "5", badgeColor: "nb-red" },
      { path: "/updated-dashboard/sp/notifications", icon: Bell, label: "Notifications", badge: "3", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Work",
    items: [
      { path: "/updated-dashboard/sp/orders", icon: ShoppingBag, label: "Orders", badge: "14", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/sp/services", icon: Briefcase, label: "My Services", badge: null },
      { path: "/updated-dashboard/sp/events", icon: Calendar, label: "My Events", badge: null },
      { path: "/updated-dashboard/sp/clients", icon: Users, label: "Clients", badge: null },
    ],
  },
  {
    section: "Finance",
    items: [
      { path: "/updated-dashboard/sp/finance", icon: Wallet, label: "Finance", badge: null },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/sp/profile", icon: UserCircle, label: "Profile", badge: null },
      { path: "/updated-dashboard/sp/verification", icon: ShieldCheck, label: "Verification Centre", badge: "!", badgeColor: "nb-sky" },
      { path: "/updated-dashboard/sp/settings", icon: Settings, label: "Settings", badge: null },
    ],
  },
];