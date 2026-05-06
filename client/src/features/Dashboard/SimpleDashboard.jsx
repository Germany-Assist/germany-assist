import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { 
  Bell, 
  MessageSquare, 
  HelpCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Wallet,
  UserCircle,
  ShieldCheck,
  Heart,
  AlertCircle,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  MetricCard,
  ActionFeed,
  PendingOrders,
  OrdersTable,
  StatusBreakdown,
} from "../../components/ui/dashboard";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: true },
  { icon: MessageSquare, label: "Messages", path: "/dashboard/messages", badge: 5, badgeColor: "red" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications", badge: 3, badgeColor: "red" },
  { icon: ShoppingBag, label: "Orders", path: "/dashboard/orders", badge: 14, badgeColor: "blue" },
  { icon: Briefcase, label: "My Services", path: "/dashboard/services" },
  { icon: Briefcase, label: "My Events", path: "/dashboard/events" },
  { icon: Users, label: "Clients", path: "/dashboard/clients" },
  { icon: Wallet, label: "Finance", path: "/dashboard/finance" },
  { icon: HelpCircle, label: "Guide", path: "/guide" },
];

const accountItems = [
  { icon: UserCircle, label: "Profile", path: "/dashboard/profile" },
  { icon: AlertCircle, label: "Verification Centre", path: "/dashboard/verification", badge: "!", badgeColor: "sky" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function SimpleDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sample data - replace with real data from props/API
  const kpis = {
    balance: "€2,340",
    pending: "€840",
    thisMonth: "€1,190",
    thisMonthGrowth: "+12%",
    activeOrders: 18,
  };

  const actionFeedItems = [
    { id: 1, type: "message", text: "Khalid Farouk sent a message about his dispute", urgent: "Urgent · Reply needed", time: "2m" },
    { id: 2, type: "order", text: "Lena's B2 Workshop awaiting your delivery confirmation", urgent: null, time: "30m" },
    { id: 3, type: "event", text: "Your German A1 session with Rami starts in 2h", urgent: null, time: "1h" },
    { id: 4, type: "warning", text: "3 orders are overdue — approve or decline pending requests", urgent: "Overdue", time: "3h" },
    { id: 5, type: "verification", text: "Verification Centre: 1 document requires re-upload", urgent: null, time: "Yesterday" },
  ];

  const pendingOrdersItems = [
    { id: 1, service: "German A2 Course", client: "Sophie Müller", orderId: "8770", amount: "€160", status: "pending" },
    { id: 2, service: "Doc Translation", client: "Maria Kovacs", orderId: "8801", amount: "€95", status: "pending" },
    { id: 3, service: "Visa Consulting", client: "Khalid Farouk", orderId: "8780", amount: "€150", status: "disputed" },
    { id: 4, service: "B1 Workshop", client: "Hans Weber", orderId: "8766", amount: "€200", status: "pending" },
    { id: 5, service: "German A1 Course", client: "Rami Al-Harbi", orderId: "8755", amount: "€180", status: "pending" },
  ];

  const statusBreakdownItems = [
    { status: "active", label: "Active", count: 18 },
    { status: "pending", label: "Pending", count: 7 },
    { status: "completed", label: "Completed", count: 38 },
    { status: "disputed", label: "Disputed", count: 3 },
  ];

  const ordersData = [
    { service: "German A2 Course", sub: "Course · 8 sessions", client: "Sophie Müller", clientId: "#CLT-0033", orderId: "#ORD-8770", date: "24 Mar 2026", due: "10 Apr", amount: "€160", status: "pending", isNew: true },
    { service: "German A1 Course", sub: "Course · 12 sessions", client: "Rami Al-Harbi", clientId: "#CLT-0071", orderId: "#ORD-8755", date: "20 Mar 2026", due: "12 Apr", amount: "€180", status: "pending", isNew: true },
    { service: "Visa Consulting", sub: "Consulting · 2 sessions", client: "Khalid Farouk", clientId: "#CLT-0042", orderId: "#ORD-8780", date: "18 Mar 2026", due: "08 Apr", amount: "€150", status: "disputed", isNew: false },
    { service: "B2 Workshop", sub: "Workshop · 4 hours", client: "Lena Schmidt", clientId: "#CLT-0018", orderId: "#ORD-8742", date: "15 Mar 2026", due: "05 Apr", amount: "€200", status: "active", isNew: false },
    { service: "A1 Course", sub: "Course · 10 sessions", client: "Hans Weber", clientId: "#CLT-0055", orderId: "#ORD-8721", date: "12 Mar 2026", due: "28 Mar", amount: "€220", status: "completed", isNew: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f9ff]">
      {/* SIDEBAR */}
      <aside className="w-56 bg-white border-r border-[rgba(2,76,238,0.10)] flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-4 border-b border-[rgba(2,76,238,0.10)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-[rgba(2,76,238,0.10)] flex flex-col overflow-hidden">
              <div className="flex-1 bg-black"></div>
              <div className="flex-1 bg-[#d60d2e]"></div>
              <div className="flex-1 bg-[#f6ce17]"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#0a0f1e] leading-tight">Germany Assists</div>
              <div className="text-[10px] text-[#6b7280]">Provider Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors mb-0.5 ${
                item.active 
                  ? "bg-[rgba(2,76,238,0.07)] text-[#024CEE] font-medium" 
                  : "text-[#6b7280] hover:bg-[rgba(2,76,238,0.07)] hover:text-[#024CEE]"
              }`}
            >
              <item.icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  item.badgeColor === "red" ? "bg-[#E53E3E] text-white" :
                  item.badgeColor === "blue" ? "bg-[#024CEE] text-white" :
                  "bg-[#49B7DF] text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}

          <div className="text-[9.5px] font-semibold uppercase text-[#6b7280] mt-4 mb-2 px-3">Account</div>
          {accountItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-[#6b7280] hover:bg-[rgba(2,76,238,0.07)] hover:text-[#024CEE] transition-colors mb-0.5"
            >
              <item.icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#49B7DF] text-white">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div className="p-3 border-t border-[rgba(2,76,238,0.10)]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[rgba(2,76,238,0.07)]">
            <div className="w-8 h-8 rounded-lg bg-[#024CEE] flex items-center justify-center text-white text-xs font-bold">
              GA
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#0a0f1e]">Germany Assists</div>
              <div className="text-[10.5px] text-[#6b7280]">Service Provider</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-56 p-6">
        {/* TOPBAR */}
        <div className="bg-white border-b border-[rgba(2,76,238,0.10)] px-6 py-3 flex items-center gap-3 rounded-lg mb-5">
          <span className="text-sm font-semibold flex-1 text-[#0a0f1e]">Dashboard</span>
          
          {/* Period Pill */}
          <div className="flex bg-[#f7f9ff] border border-[rgba(2,76,238,0.10)] rounded-lg overflow-hidden">
            <button className="px-3 py-1.5 text-[11.5px] bg-[#024CEE] text-white font-medium">This Month</button>
            <button className="px-3 py-1.5 text-[11.5px] text-[#6b7280] hover:text-[#024CEE]">Last Month</button>
            <button className="px-3 py-1.5 text-[11.5px] text-[#6b7280] hover:text-[#024CEE]">Custom</button>
          </div>

          <button className="w-8 h-8 rounded-lg border border-[rgba(2,76,238,0.10)] flex items-center justify-center text-[#6b7280] hover:text-[#024CEE]">
            <Bell size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg border border-[rgba(2,76,238,0.10)] flex items-center justify-center text-[#6b7280] hover:text-[#024CEE]">
            <MessageSquare size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg border border-[rgba(2,76,238,0.10)] flex items-center justify-center text-[#6b7280] hover:text-[#024CEE]">
            <HelpCircle size={16} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-[#024CEE] flex items-center justify-center text-white text-xs font-bold">
            GA
          </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <MetricCard
            type="balance"
            label="Available Balance"
            value={kpis.balance}
            subValue="Ready to withdraw"
            variant="primary"
            action="Withdraw"
          />
          <MetricCard
            type="pending"
            label="Pending Earnings"
            value={kpis.pending}
            subValue={{ trend: "escrow", label: "In escrow" }}
            variant="warning"
          />
          <MetricCard
            type="thisMonth"
            label="This Month"
            value={kpis.thisMonth}
            subValue={{ trend: "up", label: `${kpis.thisMonthGrowth} vs last` }}
            variant="success"
          />
          <MetricCard
            type="activeOrders"
            label="Active Orders"
            value={kpis.activeOrders}
            subValue={{ trend: "progress", label: "In progress" }}
          />
        </div>

        {/* MIDDLE GRID */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Action Needed */}
          <div className="bg-white border border-[rgba(2,76,238,0.10)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="text-[13px] font-semibold text-[#0a0f1e]">Action Needed</div>
              </div>
              <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {actionFeedItems.length} items
              </span>
            </div>
            <ActionFeed 
              items={actionFeedItems}
              onItemClick={(item) => console.log("Clicked:", item)}
            />
          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-[rgba(2,76,238,0.10)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold text-[#0a0f1e]">Pending Orders</div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {pendingOrdersItems.length} pending
                </span>
                <span 
                  onClick={() => navigate("/dashboard/orders")}
                  className="text-[11px] text-[#024CEE] font-medium cursor-pointer hover:underline"
                >
                  All →
                </span>
              </div>
            </div>
            <PendingOrders
              items={pendingOrdersItems}
              onItemClick={(item) => console.log("Clicked:", item)}
            />
          </div>

          {/* Status Breakdown */}
          <div className="bg-white border border-[rgba(2,76,238,0.10)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold text-[#0a0f1e]">Status Breakdown</div>
            </div>
            <StatusBreakdown
              items={statusBreakdownItems}
              onItemClick={(item) => console.log("Clicked:", item)}
            />
          </div>
        </div>

        {/* ORDERS TABLE */}
        <OrdersTable
          data={ordersData}
          onRowClick={(row) => console.log("Clicked:", row)}
        />
      </main>
    </div>
  );
}