import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserCircle,
  Bell,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export const clientNav = [
  {
    section: "Overview",
    items: [
      { path: "/updated-dashboard/client", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { path: "/updated-dashboard/client/notifications", icon: Bell, label: "Notifications", badge: "2", badgeColor: "nb-red" },
      { path: "/updated-dashboard/client/messages", icon: MessageSquare, label: "Messages", badge: "3", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Activity",
    items: [
      { path: "/updated-dashboard/client/orders", icon: ShoppingBag, label: "Orders", badge: "2", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/client/favorites", icon: Heart, label: "Favorites", badge: null },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/client/profile", icon: UserCircle, label: "Profile", badge: null },
      { path: "/updated-dashboard/client/disputes", icon: AlertCircle, label: "Disputes", badge: null },
    ],
  },
];