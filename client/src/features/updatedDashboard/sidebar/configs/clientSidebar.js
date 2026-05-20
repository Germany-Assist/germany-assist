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
      { path: "/updated-dashboard/client", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/updated-dashboard/client/notifications", icon: Bell, label: "Notifications", badgeKey: "notifications", badgeColor: "nb-red" },
      { path: "/updated-dashboard/client/messages", icon: MessageSquare, label: "Messages", badgeKey: "messages", badgeColor: "nb-red" },
    ],
  },
  {
    section: "Activity",
    items: [
      { path: "/updated-dashboard/client/orders", icon: ShoppingBag, label: "Orders", badgeKey: "orders", badgeColor: "nb-blue" },
      { path: "/updated-dashboard/client/favorites", icon: Heart, label: "Favorites" },
    ],
  },
  {
    section: "Account",
    items: [
      { path: "/updated-dashboard/client/profile", icon: UserCircle, label: "Profile" },
      { path: "/updated-dashboard/client/disputes", icon: AlertCircle, label: "Disputes" },
    ],
  },
];