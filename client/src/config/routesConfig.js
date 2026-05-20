import { lazy } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Wallet,
  UserCircle,
  Heart,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Home,
  Info,
  Briefcase as JobsIcon,
  LogIn,
  UserPlus,
  Key,
  Bell,
  Calendar,
  Settings,
} from "lucide-react";

// Updated Dashboard
const UpdatedDashboardLayout = lazy(() => import("../features/updatedDashboard/UpdatedDashboardLayout"));
const SPDashboard = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Dashboard"));
const SPMessages = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Messages"));
const SPNotifications = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Notifications"));
const SPOrders = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Orders"));
const SPMyServices = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/MyServices"));
const SPMyEvents = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/MyEvents"));
const SPClients = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Clients"));
const SPFinance = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Finance"));
const SPProfile = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Profile"));
const SPVerificationCentre = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/VerificationCentre"));
const SPSettings = lazy(() => import("../features/updatedDashboard/pages/serviceProvider/Settings"));

// Updated Dashboard Client
const ClientDashboard = lazy(() => import("../features/updatedDashboard/pages/client/ClientDashboard"));

// Updated Dashboard Admin
const UpdatedAdminDashboard = lazy(() => import("../features/updatedDashboard/pages/admin/AdminDashboard"));
const UpdatedAdminUsers = lazy(() => import("../features/updatedDashboard/pages/admin/AdminUsers"));
const UpdatedAdminProviders = lazy(() => import("../features/updatedDashboard/pages/admin/AdminProviders"));
const UpdatedAdminOrders = lazy(() => import("../features/updatedDashboard/pages/admin/AdminOrders"));
const UpdatedAdminFinance = lazy(() => import("../features/updatedDashboard/pages/admin/AdminFinance"));
const UpdatedAdminVerification = lazy(() => import("../features/updatedDashboard/pages/admin/AdminVerification"));
const UpdatedAdminNotifications = lazy(() => import("../features/updatedDashboard/pages/admin/AdminNotifications"));
const UpdatedAdminProfile = lazy(() => import("../features/updatedDashboard/pages/admin/AdminProfile"));
const UpdatedAdminSettings = lazy(() => import("../features/updatedDashboard/pages/admin/AdminSettings"));

// Public Pages
const Homepage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const JobsPage = lazy(() => import("../pages/JobsPage"));
const ServicesPage = lazy(() => import("../pages/ServicesPage"));
const ServiceProfile = lazy(
  () => import("../features/service/serviceProfile/ServiceProfile"),
);
const ServiceProfileAdmin = lazy(
  () => import("../features/service/serviceProfile/ServiceProfileAdmin"),
);
const ServiceViewProvider = lazy(
  () => import("../features/service/serviceProfile/ServiceViewProvider"),
);
const TimelinePage = lazy(() => import("../pages/TimelinePage"));
const ProviderTimeline = lazy(() => import("../pages/ProviderTimelinePage"));
const SigninPage = lazy(() => import("../features/auth/pages/SigninPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));
const IndividualSignupPage = lazy(() => import("../features/auth/pages/IndividualSignupPage"));
const ProviderSignupPage = lazy(() => import("../features/auth/pages/ProviderSignupPage"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage"),
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// Dashboard Layout
const DashboardPage = lazy(() => import("../pages/DashboardPage"));

// Admin Tabs
const AdminGeneral = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminGeneral"),
);
const AdminServices = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminServices"),
);
const AdminOrders = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminOrders"),
);
const AdminUsers = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminUsers"),
);
const AdminServiceProviders = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminServiceProviders"),
);
const AdminProfile = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminProfile"),
);
const AdminFinance = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminFinance"),
);
const AdminVerificationRequests = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminVerificationRequests"),
);
const AdminNotifications = lazy(
  () => import("../features/Dashboard/tabs/admin/AdminNotifications"),
);
const CreateNewSP = lazy(
  () => import("../features/Dashboard/tabs/admin/features/CreateNewSP"),
);

// Client Tabs
const ClientGeneral = lazy(
  () => import("../features/Dashboard/tabs/client/ClientGeneral"),
);
const ClientServices = lazy(
  () => import("../features/Dashboard/tabs/client/ClientServices"),
);
const ClientOrders = lazy(
  () => import("../features/Dashboard/tabs/client/ClientOrders"),
);
const ClientProfile = lazy(
  () => import("../features/Dashboard/tabs/client/ClientProfile"),
);
const ClientDisputes = lazy(
  () => import("../features/Dashboard/tabs/client/ClientDisputes"),
);
const ClientFavorite = lazy(
  () => import("../features/Dashboard/tabs/client/ClientFavorite"),
);
const ClientNotifications = lazy(
  () => import("../features/Dashboard/tabs/client/ClientNotifications"),
);

// Service Provider Tabs
const ServiceProviderGeneral = lazy(
  () =>
    import("../features/Dashboard/tabs/serviceProvider/ServiceProviderGeneral"),
);
const ServiceProviderServices = lazy(
  () =>
    import("../features/Dashboard/tabs/serviceProvider/ServiceProviderServices"),
);
const ServiceProviderFinance = lazy(
  () =>
    import("../features/Dashboard/tabs/serviceProvider/ServiceProviderFinance"),
);
const SPCreateService = lazy(
  () => import("../features/Dashboard/tabs/serviceProvider/SPCreateService"),
);
const SPManageTimelines = lazy(
  () => import("../features/Dashboard/tabs/serviceProvider/SPManageTimelines"),
);
const ServiceProviderVariants = lazy(
  () =>
    import("../features/Dashboard/tabs/serviceProvider/ServiceProviderVariants"),
);
const SPDisputes = lazy(
  () => import("../features/Dashboard/tabs/serviceProvider/SPDisputes"),
);
const ProviderVerification = lazy(
  () =>
    import("../features/Dashboard/tabs/serviceProvider/ProviderVerification"),
);
export const routesConfig = [
  {
    path: "/",
    element: Homepage,
    handle: { label: "Home", icon: Home },
  },
  {
    path: "/about",
    element: AboutPage,
    handle: { label: "About Us", icon: Info },
  },
  {
    path: "/jobs",
    element: JobsPage,
    handle: { label: "Jobs", icon: JobsIcon },
  },
  {
    path: "/signin",
    element: SigninPage,
    handle: { label: "Sign In", icon: LogIn },
  },
  {
    path: "/signup",
    element: SignupPage,
    handle: { label: "Sign Up", icon: UserPlus },
  },
  {
    path: "/signup/individual",
    element: IndividualSignupPage,
    handle: { label: "Individual Sign Up", icon: UserPlus },
  },
  {
    path: "/signup/provider",
    element: ProviderSignupPage,
    handle: { label: "Provider Sign Up", icon: UserPlus },
  },
  {
    path: "/forgot-password",
    element: ForgotPasswordPage,
    handle: { label: "Forgot Password", icon: Key },
  },
  {
    path: "/services",
    element: ServicesPage,
    handle: { label: "Services" },
  },
  {
    path: "/service/:serviceId",
    element: ServiceProfile,
    handle: { label: "Service Profile" },
  },
  {
    path: "/admin/service/:id",
    element: ServiceProfileAdmin,
    handle: { label: "Service Admin View" },
    roles: ["admin", "super_admin"],
  },
  {
    path: "/provider/service/:id",
    element: ServiceViewProvider,
    handle: { label: "Service Provider View" },
    roles: ["service_provider_root"],
  },
  {
    path: "/timeline/:timelineId",
    element: TimelinePage,
    handle: { label: "Timeline" },
  },
  {
    path: "/provider/timeline/:id",
    element: ProviderTimeline,
    handle: { label: "Provider Timeline" },
    roles: ["service_provider_root"],
  },
  {
    path: "/dashboard",
    element: DashboardPage,
    handle: { label: "Dashboard" },
    roles: ["admin", "super_admin", "client", "service_provider_root"],
    children: [
      // Admin Routes
      {
        path: "",
        element: AdminGeneral,
        handle: { label: "General", icon: LayoutDashboard },
        roles: ["admin", "super_admin"],
      },
      {
        path: "users",
        element: AdminUsers,
        handle: { label: "Users", icon: Users },
        roles: ["admin", "super_admin"],
        children: [
          {
            path: "create",
            element: AdminGeneral,
            handle: { label: "Create New Admin" },
          },
        ],
      },
      {
        path: "services",
        element: AdminServices,
        handle: { label: "Service", icon: Briefcase },
        roles: ["admin", "super_admin"],
      },
      {
        path: "orders",
        element: AdminOrders,
        handle: { label: "Orders", icon: ShoppingBag },
        roles: ["admin", "super_admin"],
      },
      {
        path: "finance",
        element: AdminFinance,
        handle: { label: "Finance", icon: Wallet },
        roles: ["admin", "super_admin"],
      },
      {
        path: "providers",
        element: AdminServiceProviders,
        handle: { label: "Service Providers", icon: Users },
        roles: ["admin"],
        children: [
          {
            path: "create",
            element: CreateNewSP,
            handle: { label: "Create New Service Provider" },
          },
        ],
      },
      {
        path: "service-providers",
        element: AdminServiceProviders,
        handle: { label: "Service Providers", icon: Users },
        roles: ["super_admin"],
        children: [
          {
            path: "new",
            element: CreateNewSP,
            handle: { label: "New Service Provider" },
          },
          {
            path: "verification",
            element: AdminVerificationRequests,
            handle: { label: "Verification Requests" },
          },
        ],
      },
      {
        path: "profile",
        element: AdminProfile,
        handle: { label: "Profile", icon: UserCircle },
        roles: ["admin", "super_admin"],
      },
      {
        path: "notifications",
        element: AdminNotifications,
        handle: { label: "Notifications", icon: MessageSquare },
        roles: ["super_admin"],
      },

      // Client Routes
      {
        path: "",
        element: ClientGeneral,
        handle: { label: "General", icon: LayoutDashboard },
        roles: ["client"],
      },
      {
        path: "orders",
        element: ClientOrders,
        handle: { label: "Orders", icon: ShoppingBag },
        roles: ["client"],
      },
      {
        path: "notifications",
        element: ClientNotifications,
        handle: { label: "Notifications", icon: MessageSquare },
        roles: ["client"],
      },
      {
        path: "favorite",
        element: ClientFavorite,
        handle: { label: "Favorite", icon: Heart },
        roles: ["client"],
      },
      {
        path: "profile",
        element: ClientProfile,
        handle: { label: "Profile", icon: UserCircle },
        roles: ["client"],
      },
      {
        path: "disputes",
        element: ClientDisputes,
        handle: { label: "Disputes", icon: AlertCircle },
        roles: ["client"],
      },
      {
        path: "messages",
        element: ClientOrders,
        handle: { label: "Messages", icon: MessageSquare },
        roles: ["client"],
      },

      // Service Provider Routes
      {
        path: "",
        element: ServiceProviderGeneral,
        handle: { label: "General", icon: LayoutDashboard },
        roles: ["service_provider_root"],
      },
      {
        path: "services",
        element: ServiceProviderServices,
        handle: { label: "Services", icon: Briefcase },
        roles: ["service_provider_root"],
        children: [
          {
            path: "service",
            element: ServiceProviderServices,
            handle: { label: "Manage Service" },
          },
          {
            path: "variants",
            element: ServiceProviderVariants,
            handle: { label: "Manage Variants" },
          },
          {
            path: "timelines",
            element: SPManageTimelines,
            handle: { label: "Manage Timelines" },
          },
          {
            path: "create",
            element: SPCreateService,
            handle: { label: "Create New Service" },
          },
        ],
      },
      {
        path: "notifications",
        element: SPNotifications,
        handle: { label: "Notifications", icon: MessageSquare },
        roles: ["service_provider_root"],
      },
      {
        path: "finance",
        element: ServiceProviderFinance,
        handle: { label: "Finance", icon: Wallet },
        roles: ["service_provider_root"],
      },
      {
        path: "disputes",
        element: SPDisputes,
        handle: { label: "Disputes", icon: AlertCircle },
        roles: ["service_provider_root"],
      },
      {
        path: "verification",
        element: ProviderVerification,
        handle: { label: "Verification", icon: ShieldCheck },
        roles: ["service_provider_root"],
      },
    ],
  },
  {
    path: "*",
    element: NotFoundPage,
    handle: { label: "Not Found" },
  },
  // Updated Dashboard - Service Provider
  {
    path: "/updated-dashboard/sp",
    element: UpdatedDashboardLayout,
    handle: { label: "Dashboard", icon: LayoutDashboard },
    roles: ["service_provider_root"],
    children: [
      {
        path: "",
        element: SPDashboard,
        handle: { label: "Dashboard", icon: LayoutDashboard },
      },
      {
        path: "messages",
        element: SPMessages,
        handle: { label: "Messages", icon: MessageSquare },
      },
      {
        path: "notifications",
        element: SPNotifications,
        handle: { label: "Notifications", icon: Bell },
      },
      {
        path: "orders",
        element: SPOrders,
        handle: { label: "Orders", icon: ShoppingBag },
      },
      {
        path: "services",
        element: SPMyServices,
        handle: { label: "My Services", icon: Briefcase },
      },
      {
        path: "events",
        element: SPMyEvents,
        handle: { label: "My Events", icon: Calendar },
      },
      {
        path: "clients",
        element: SPClients,
        handle: { label: "Clients", icon: Users },
      },
      {
        path: "finance",
        element: SPFinance,
        handle: { label: "Finance", icon: Wallet },
      },
      {
        path: "profile",
        element: SPProfile,
        handle: { label: "Profile", icon: UserCircle },
      },
      {
        path: "verification",
        element: SPVerificationCentre,
        handle: { label: "Verification Centre", icon: ShieldCheck },
      },
      {
        path: "settings",
        element: SPSettings,
        handle: { label: "Settings", icon: Settings },
      },
    ],
  },
  // Updated Dashboard - Client
  {
    path: "/updated-dashboard/client",
    element: UpdatedDashboardLayout,
    handle: { label: "Dashboard", icon: LayoutDashboard },
    roles: ["client"],
    children: [
      {
        path: "",
        element: ClientDashboard,
        handle: { label: "Dashboard", icon: LayoutDashboard },
      },
      {
        path: "messages",
        element: ClientDashboard,
        handle: { label: "Messages", icon: MessageSquare },
      },
      {
        path: "notifications",
        element: ClientDashboard,
        handle: { label: "Notifications", icon: Bell },
      },
      {
        path: "orders",
        element: ClientDashboard,
        handle: { label: "Orders", icon: ShoppingBag },
      },
      {
        path: "favorites",
        element: ClientDashboard,
        handle: { label: "Favorites", icon: Heart },
      },
      {
        path: "profile",
        element: ClientDashboard,
        handle: { label: "Profile", icon: UserCircle },
      },
      {
        path: "disputes",
        element: ClientDashboard,
        handle: { label: "Disputes", icon: AlertCircle },
      },
    ],
  },
  // Updated Dashboard - Admin
  {
    path: "/updated-dashboard/admin",
    element: UpdatedDashboardLayout,
    handle: { label: "Dashboard", icon: LayoutDashboard },
    roles: ["admin", "super_admin"],
    children: [
      {
        path: "",
        element: UpdatedAdminDashboard,
        handle: { label: "Dashboard", icon: LayoutDashboard },
      },
      {
        path: "notifications",
        element: UpdatedAdminNotifications,
        handle: { label: "Notifications", icon: Bell },
      },
      {
        path: "users",
        element: UpdatedAdminUsers,
        handle: { label: "Users", icon: Users },
      },
      {
        path: "providers",
        element: UpdatedAdminProviders,
        handle: { label: "Service Providers", icon: Briefcase },
      },
      {
        path: "orders",
        element: UpdatedAdminOrders,
        handle: { label: "Orders", icon: ShoppingBag },
      },
      {
        path: "finance",
        element: UpdatedAdminFinance,
        handle: { label: "Finance", icon: Wallet },
      },
      {
        path: "verification",
        element: UpdatedAdminVerification,
        handle: { label: "Verification", icon: ShieldCheck },
      },
      {
        path: "profile",
        element: UpdatedAdminProfile,
        handle: { label: "Profile", icon: UserCircle },
      },
      {
        path: "settings",
        element: UpdatedAdminSettings,
        handle: { label: "Settings", icon: Settings },
      },
    ],
  },
];
