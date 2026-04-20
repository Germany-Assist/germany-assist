import ClientGeneral from "./client/ClientGeneral";
import ClientServices from "./client/ClientServices";
import ClientOrders from "./client/ClientOrders";
import ClientProfile from "./client/ClientProfile";

import AdminGeneral from "./admin/AdminGeneral";
import AdminServices from "./admin/AdminServices";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import AdminServiceProviders from "./admin/AdminServiceProviders";
import ServiceProviderGeneral from "./serviceProvider/ServiceProviderGeneral";
import ServiceProviderServices from "./serviceProvider/ServiceProviderServices";
import ServiceProviderFinance from "./serviceProvider/ServiceProviderFinance";
import AdminProfile from "./admin/AdminProfile";
import SPCreateService from "./serviceProvider/SPCreateService";
import CreateNewSP from "./admin/features/CreateNewSP";
import SPManageTimelines from "./serviceProvider/SPManageTimelines";
import ServiceProviderVariants from "./serviceProvider/ServiceProviderVariants";
import AdminFinance from "./admin/AdminFinance";
import SPDisputes from "./serviceProvider/SPDisputes";
import ClientDisputes from "./client/ClientDisputes";
import ClientFavorite from "./client/ClientFavorite";
import ProviderVerification from "./serviceProvider/ProviderVerification";
import AdminVerificationRequests from "./admin/AdminVerificationRequests";
import SPNotifications from "./serviceProvider/SPNotifications";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Wallet,
  UserCircle,
  ShieldCheck,
  Heart,
  MessageSquare,
  AlertCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import AdminNotifications from "./admin/AdminNotifications";
import ClientNotifications from "./client/ClientNotifications";

// ... existing component imports ...

export default {
  admin: {
    General: {
      label: "General",
       path: "", 
      icon: LayoutDashboard,
      component: AdminGeneral,
    },
    Users: {
      label: "Users",
      path: "users",
      icon: Users,
      component: AdminUsers,
      children: [{ label: "Create New Admin",  path: "create",component: AdminGeneral }],
    },
    Services: {
      label: "Service",
      path: "services",
      icon: Briefcase,
      component: AdminServices,
    },
    Orders: {
      label: "Orders",
       path: "orders",
      icon: ShoppingBag,
      component: AdminOrders,
    },
    Finance: {
      label: "Finance",
       path: "finance",
      icon: Wallet,
      component: AdminFinance,
    },
    ServiceProvider: {
      label: "Service Providers",
       path: "providers",
      icon: Users,
      component: AdminServiceProviders,
      children: [
        { label: "Create New Service Provider",path: "create", component: CreateNewSP },
      ],
    },
    Profile: {
      label: "Profile",
       path: "profile",
      icon: UserCircle,
      component: AdminProfile,
    },
  },
  super_admin: {
    General: {
      label: "General",
      path:"",
      icon: LayoutDashboard,
      component: AdminGeneral,
    },
    Users: {
      label: "Users",
      path:"user",
      icon: Users,
      component: AdminUsers,
      children: [{ label: "Create New Admin",path:"create", component: AdminGeneral }],
    },
    Services: {
      label: "Service",
      path:"services",
      icon: Briefcase,
      component: AdminServices,
    },
    Orders: {
      label: "Orders",
      path:"orders",
      icon: ShoppingBag,
      component: AdminOrders,
    },
      Notifications: {
      label: "Notifications",
      path:"notifications",
      icon: MessageSquare,
      component: AdminNotifications,
    },
    Finance: {
      label: "Finance",
      path: "finance",
      icon: Wallet,
      component: AdminFinance,
    },
    ServiceProvider: {
      label: "Service Providers",
        path: "service-providers",
      icon: Users,
      component: AdminServiceProviders,
      children: [
        { label: "New Service Provider", path: "new", component: CreateNewSP },
        {
          label: "Verification Requests",
          path: "verification",
          component: AdminVerificationRequests,
        },
      ],
    },
    Profile: {
      label: "Profile",
      path:"profile",
      icon: UserCircle,
      component: AdminProfile,
    },
  },
  client: {
    General: {
      label: "General",
      path:"",
      icon: LayoutDashboard,
      component: ClientGeneral,
    },
    Orders: {
      label: "Orders",
      path:"orders",
      icon: ShoppingBag,
      component: ClientOrders,
    },
    Notifications: {
      label: "Notifications",
      path:"notifications",
      icon: MessageSquare,
      component: ClientNotifications,
    },
    Favorite: {
      label: "Favorite",
      path:"favorite",
      icon: Heart,
      component: ClientFavorite,
    },
    Profile: {
      label: "Profile",
      path:"profile",
      icon: UserCircle,
      component: ClientProfile,
    },
    Disputes: {
      label: "Disputes",
      path:"disputes",
      icon: AlertCircle,
      component: ClientDisputes,
    },
    Messages: {
      label: "Messages",
      path:"messages",
      icon: MessageSquare,
      component: ClientOrders,
    },
  },
  service_provider_root: {
    General: {
      label: "General",
      path:"",
      icon: LayoutDashboard,
      component: ServiceProviderGeneral,
    },
    Services: {
      label: "Services",
      path:"services",
      icon: Briefcase,
      component: ServiceProviderServices,
      children: [
        { label: "Manage Service",path:"service", component: ServiceProviderServices },
        { label: "Manage Variants",path:"variants", component: ServiceProviderVariants },
        { label: "Manage Timelines",path:"timelines", component: SPManageTimelines },
        { label: "Create New Service",path:"create", component: SPCreateService },
      ],
    },
     Notifications: {
      label: "Notifications",
      path:"notifications",
      icon: MessageSquare,
      component: SPNotifications,
    },
    Finance: {
      label: "Finance",
      path:"finance",
      icon: Wallet,
      component: ServiceProviderFinance,
    },
    Disputes: {
      label: "Disputes",
      path:"disputes",
      icon: AlertCircle,
      component: SPDisputes,
    },
    Verification: {
      label: "Verification",
      path:"verification",
      icon: ShieldCheck,
      component: ProviderVerification,
    },
  },
};
