import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../contexts/ProfileContext";
import { fetchClientOrders, fetchUserChats } from "../../api/clientUserApis";
import { getNotifications } from "../../api/notificationaApi";
import {
  getAllServices,
  serviceProviderGetAllOrders,
  serviceProviderFinanceInit,
} from "../../api/serviceProviderApis";
import {
  getAllUsers,
  getAllRequests,
  getAllServicesStatistical,
  getAllFinanceStatistical,
} from "../../api/adminApis";

const ROLE_LABELS = {
  client: "Client",
  service_provider_root: "Service Provider",
  service_provider_rep: "Service Provider",
  admin: "Administrator",
  super_admin: "Super Administrator",
  employer_root: "Employer",
  employer: "Employer",
};

const STATUS_DOTS = {
  active: "bg-emerald-500",
  approved: "bg-emerald-500",
  live: "bg-emerald-500",
  pending_completion: "bg-amber-500",
  pending: "bg-amber-500",
  completed: "bg-blue-600",
  rejected: "bg-red-500",
  refunded: "bg-red-500",
  open: "bg-red-500",
};

const TONES = {
  amber: {
    edge: "border-l-amber-500",
    value: "text-amber-600",
  },
  red: {
    edge: "border-l-red-500",
    value: "text-red-600",
  },
  sky: {
    edge: "border-l-sky-600",
    value: "text-sky-700",
  },
};

/* ---------- helpers ---------- */

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function timeAgo(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/* ---------- primitives ---------- */

const TITLE = "text-light-text";
const MUTED = "text-slate-500";
const META = "text-slate-600";
const LINK =
  "text-slate-600 hover:text-sky-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700 rounded-sm";
const PANEL = "bg-white border border-light-700 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.06)]";
const DIVIDER = "border-b border-light-700/60 last:border-0";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700 rounded-sm";

function Panel({ title, action, actionTo, children, className = "" }) {
  return (
    <section className={`${PANEL} ${className}`}>
      <header className="flex items-center justify-between px-6 pt-5 pb-1">
        <h2 className={`text-sm font-bold ${TITLE}`}>{title}</h2>
        {action && actionTo && (
          <Link to={actionTo} className={`text-xs font-medium ${LINK}`}>
            {action}
          </Link>
        )}
      </header>
      <div className="px-6 pb-4">{children}</div>
    </section>
  );
}

function Row({ to, title, meta, right, rightMeta, clampTitle }) {
  return (
    <div className={`py-3.5 ${DIVIDER}`}>
      <div className="flex items-baseline justify-between gap-4">
        {to ? (
          <Link
            to={to}
            className={`text-sm ${TITLE} hover:text-sky-700 transition-colors ${
              clampTitle ? "line-clamp-2" : "truncate"
            } ${FOCUS}`}
          >
            {title}
          </Link>
        ) : (
          <span
            className={`text-sm ${TITLE} ${clampTitle ? "line-clamp-2" : "truncate"}`}
          >
            {title}
          </span>
        )}
        {right && <span className={`text-xs ${META} shrink-0`}>{right}</span>}
      </div>
      {(meta || rightMeta) && (
        <div className="flex items-baseline justify-between gap-4 mt-0.5">
          <span className={`text-xs ${MUTED} truncate`}>{meta}</span>
          {rightMeta && (
            <span className={`text-xs ${MUTED} shrink-0`}>{rightMeta}</span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          STATUS_DOTS[status] || "bg-slate-400"
        }`}
        aria-hidden="true"
      />
      <span className={`text-[11px] uppercase tracking-wide ${META}`}>
        {String(status).replace(/_/g, " ")}
      </span>
    </span>
  );
}

function Empty({ children }) {
  return <p className={`text-xs ${MUTED} py-6`}>{children}</p>;
}

function Skeleton() {
  return (
    <div className={`py-3.5 space-y-2 ${DIVIDER}`} aria-hidden="true">
      <div className="h-3 w-2/5 rounded bg-light-900 animate-pulse" />
      <div className="h-2 w-1/4 rounded bg-light-900 animate-pulse" />
    </div>
  );
}

function StatRow({ items }) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 divide-x divide-light-700 ${PANEL} overflow-hidden`}
      role="list"
      aria-label="Your stats"
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`px-6 py-5 ${index >= 2 ? "border-t sm:border-t-0 border-light-700" : ""}`}
          role="listitem"
        >
          <p
            className={`text-2xl sm:text-3xl font-bold ${TITLE} leading-none tabular-nums`}
          >
            {item.value}
          </p>
          <p className={`text-xs uppercase tracking-widest ${MUTED} mt-2`}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------- attention cards ---------- */

function AttentionCard({ tone, value, label, to, action }) {
  const t = TONES[tone];
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between gap-4 bg-white border border-light-700 border-l-2 ${t.edge} rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 ease-elegant hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,41,59,0.10)] ${FOCUS}`}
    >
      <div>
        <p
          className={`text-xl font-semibold tabular-nums leading-none ${t.value}`}
        >
          {value}
        </p>
        <p className={`text-[11px] uppercase tracking-widest ${MUTED} mt-1.5`}>
          {label}
        </p>
      </div>
      <span
        className={`text-xs ${LINK} shrink-0 group-hover:translate-x-0.5 transition-transform`}
      >
        {action} →
      </span>
    </Link>
  );
}

function AttentionBand({ items }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <AttentionCard key={item.label} {...item} />
      ))}
    </div>
  );
}

/* ---------- rows per data type ---------- */

function OrderRow({ order }) {
  const to =
    order.serviceType === "timeline" && order.relatedId
      ? `/timeline/${order.relatedId}`
      : order.serviceId
        ? `/service/${order.serviceId}`
        : "/dashboard/orders";
  return (
    <Row
      to={to}
      title={order.serviceTitle || "Service order"}
      meta={order.serviceType === "timeline" ? "Timeline" : "One-time"}
      right={<StatusDot status={order.status} />}
    />
  );
}

function EventRow({ event }) {
  const soon =
    event.sortDate && new Date(event.sortDate) - new Date() < 7 * 86400000;
  return (
    <Row
      to={`/timeline/${event.timelineId}`}
      title={event.title}
      meta={event.phase}
      right={
        <span className={soon ? "text-sky-700" : META}>
          {formatDate(event.sortDate)}
        </span>
      }
    />
  );
}

function ChatRow({ chat }) {
  const names = (chat.participants || []).map((p) => p.name).join(", ");
  const last = chat.lastMessage;
  return (
    <Row
      title={names}
      meta={
        last ? `${last.fromMe ? "You: " : ""}${last.body}` : "No messages yet"
      }
      right={timeAgo(last?.sentAt || chat.updatedAt)}
    />
  );
}

function NotificationRow({ notification }) {
  return (
    <Row
      title={notification.message || "Notification"}
      clampTitle
      meta={notification.type}
      right={
        notification.isRead ? (
          timeAgo(notification.createdAt)
        ) : (
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent-soft"
            aria-label="unread"
          />
        )
      }
    />
  );
}

function RequestRow({ request }) {
  return (
    <Row
      title={`${request.type || "Verification"} verification`}
      meta={request.status}
      right={<StatusDot status={request.status} />}
    />
  );
}

/* ---------- page ---------- */

export default function PersonalHome() {
  const { profile } = useProfile();

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeOrdersTotal, setActiveOrdersTotal] = useState(0);
  const [services, setServices] = useState([]);
  const [finance, setFinance] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  const role = profile?.role;
  const isAdmin = role === "admin" || role === "super_admin";
  const isProvider =
    role === "service_provider_root" || role === "service_provider_rep";

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    const load = async () => {
      const tasks = [fetchUserChats().catch(() => null)];

      if (role === "client") {
        tasks.push(fetchClientOrders({ page: 1, limit: 6 }).catch(() => null));
      } else if (isProvider) {
        tasks.push(getAllServices({ page: 1, limit: 6 }).catch(() => null));
        tasks.push(
          serviceProviderGetAllOrders({ page: 1, limit: 6 }).catch(() => null),
        );
        tasks.push(
          serviceProviderGetAllOrders({
            page: 1,
            limit: 1,
            status: "active",
          }).catch(() => null),
        );
        tasks.push(serviceProviderFinanceInit().catch(() => null));
      } else if (isAdmin) {
        tasks.push(getAllUsers().catch(() => null));
        tasks.push(getAllServicesStatistical().catch(() => null));
        tasks.push(getAllFinanceStatistical().catch(() => null));
        tasks.push(
          getAllRequests({ status: "pending", limit: 4 }).catch(() => null),
        );
      }
      tasks.push(
        getNotifications({ page: 1, limit: 5, isRead: "all" }).catch(
          () => null,
        ),
      );

      const results = await Promise.all(tasks);
      if (cancelled) return;

      let index = 0;
      setChats(results[index++]?.chats || []);

      if (role === "client") {
        setOrders(results[index++]?.data || []);
      } else if (isProvider) {
        setServices(results[index++]?.data || []);
        setOrders(results[index++]?.data || []);
        setActiveOrdersTotal(results[index++]?.meta?.total || 0);
        setFinance(results[index++]?.data || null);
      } else if (isAdmin) {
        const users = results[index++];
        const servicesStats = results[index++]?.data || null;
        const financeStats = results[index++]?.data || null;
        setUserCount(Array.isArray(users) ? users.length : null);
        setAdminStats({ services: servicesStats, finance: financeStats });
        setPendingRequests(results[index++]?.data || []);
      }
      setNotifications(results[index++]?.notifications || []);
      setLoading(false);
    };

    setLoading(true);
    load();
    return () => {
      cancelled = true;
    };
  }, [profile, role, isAdmin, isProvider]);

  const plainOrders = useMemo(
    () => orders.filter((o) => o.type !== "payout"),
    [orders],
  );

  const openDisputes = useMemo(
    () => plainOrders.filter((o) => o.dispute && o.dispute.status === "open"),
    [plainOrders],
  );

  const pendingCompletion = useMemo(
    () => plainOrders.filter((o) => o.status === "pending_completion"),
    [plainOrders],
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const events = [];
    for (const order of plainOrders) {
      if (!order.timeline) continue;
      const { startDate, deadlineDate, endDate, label } = order.timeline;
      if (endDate && new Date(endDate) < now) continue;
      events.push({
        timelineId: order.relatedId || order.timeline.id,
        title: order.serviceTitle || label || "Timeline service",
        phase: startDate && new Date(startDate) > now ? "Starts" : "Deadline",
        sortDate: deadlineDate || startDate,
      });
    }
    return events.sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));
  }, [plainOrders]);

  const dueThisWeek = useMemo(
    () =>
      upcomingEvents.filter(
        (e) => new Date(e.sortDate) - new Date() < 7 * 86400000,
      ).length,
    [upcomingEvents],
  );

  const attention = useMemo(() => {
    if (loading) return [];
    if (isAdmin) {
      const items = [];
      if (pendingRequests.length > 0)
        items.push({
          tone: "amber",
          value: pendingRequests.length,
          label: "Verification requests",
          to:
            role === "super_admin"
              ? "/dashboard/service-providers/verification"
              : "/dashboard",
          action: "Review",
        });
      const pendingServices = adminStats?.services?.totalPendingServices;
      if (pendingServices)
        items.push({
          tone: "amber",
          value: pendingServices,
          label: "Services awaiting approval",
          to: "/dashboard/services",
          action: "Review",
        });
      if (adminStats?.finance?.disputes)
        items.push({
          tone: "red",
          value: adminStats.finance.disputes,
          label: "Open disputes",
          to: "/dashboard/orders",
          action: "Resolve",
        });
      return items;
    }
    if (role === "client") {
      const items = [];
      if (pendingCompletion.length)
        items.push({
          tone: "amber",
          value: pendingCompletion.length,
          label: "Orders to confirm",
          to: "/dashboard/orders",
          action: "Review",
        });
      if (openDisputes.length)
        items.push({
          tone: "red",
          value: openDisputes.length,
          label: "Open disputes",
          to: "/dashboard/disputes",
          action: "Resolve",
        });
      if (dueThisWeek)
        items.push({
          tone: "sky",
          value: dueThisWeek,
          label: "Deadlines this week",
          to: "/dashboard/orders",
          action: "View",
        });
      return items;
    }
    if (isProvider) {
      const items = [];
      if (activeOrdersTotal)
        items.push({
          tone: "sky",
          value: activeOrdersTotal,
          label: "Active orders",
          to: "/dashboard/orders",
          action: "View",
        });
      const stale = services.filter(
        (s) => s.status === "pending" || s.status === "rejected",
      ).length;
      if (stale)
        items.push({
          tone: "amber",
          value: stale,
          label: "Services need attention",
          to: "/dashboard/services",
          action: "Review",
        });
      if (openDisputes.length)
        items.push({
          tone: "red",
          value: openDisputes.length,
          label: "Open disputes",
          to: "/dashboard/disputes",
          action: "Resolve",
        });
      return items;
    }
    return [];
  }, [
    loading,
    role,
    isAdmin,
    isProvider,
    pendingRequests.length,
    adminStats,
    pendingCompletion.length,
    openDisputes.length,
    dueThisWeek,
    activeOrdersTotal,
    services,
  ]);

  const stats = useMemo(() => {
    if (role === "client") {
      return [
        {
          label: "Active orders",
          value: plainOrders.filter((o) =>
            ["active", "pending_completion"].includes(o.status),
          ).length,
        },
        { label: "Favorites", value: profile?.favorites?.length || 0 },
        { label: "Chats", value: chats.length },
        { label: "Unread", value: profile?.unReadNotifications || 0 },
      ];
    }
    if (isProvider) {
      return [
        { label: "Services", value: services.length },
        { label: "Active orders", value: activeOrdersTotal },
        {
          label: "Balance",
          value: finance ? `€${(finance.balance ?? 0).toFixed(2)}` : "—",
        },
        { label: "Unread", value: profile?.unReadNotifications || 0 },
      ];
    }
    if (isAdmin) {
      return [
        { label: "Users", value: userCount ?? "—" },
        {
          label: "Services",
          value: adminStats?.services?.totalServices ?? "—",
        },
        {
          label: "Gross volume",
          value: adminStats?.finance
            ? `€${(adminStats.finance.grossTotal ?? 0).toFixed(2)}`
            : "—",
        },
        { label: "Unread", value: profile?.unReadNotifications || 0 },
      ];
    }
    return [];
  }, [
    role,
    isAdmin,
    isProvider,
    plainOrders,
    services,
    activeOrdersTotal,
    finance,
    adminStats,
    userCount,
    profile,
    chats.length,
  ]);

  const firstName = profile?.firstName || "there";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="bg-slate-50 border-t border-light-700">
      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
      {/* greeting */}
      <header className="flex items-center justify-between gap-6 mb-10 animate-fade-up">
        <div className="flex items-center gap-4 min-w-0">
          {profile?.image ? (
            <img
              src={profile.image}
              alt={`${firstName}'s profile`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="h-10 w-10 rounded-full bg-light-900 border border-light-700 flex items-center justify-center text-sm font-semibold text-light-text shrink-0">
              {`${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}`.toUpperCase() ||
                "GA"}
            </span>
          )}
          <div className="min-w-0">
            <h1 className={`text-3xl font-bold ${TITLE} tracking-tight`}>
              {greeting()}, {firstName}
            </h1>
            <p className={`text-sm ${MUTED} mt-1`}>
              {today}
              {ROLE_LABELS[role] ? ` · ${ROLE_LABELS[role]}` : ""}
            </p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700 rounded-sm"
        >
          Dashboard →
        </Link>
      </header>

      {/* needs attention */}
      {!loading && attention.length > 0 && (
        <div className="mb-10 animate-fade-up stagger-1">
          <p className={`text-sm font-bold ${TITLE} mb-3`}>
            Needs attention
          </p>
          <AttentionBand items={attention} />
        </div>
      )}
      {!loading &&
        attention.length === 0 &&
        plainOrders.length === 0 &&
        !isAdmin && (
          <p className={`text-sm ${MUTED} mb-10`}>
            Nothing needs your attention right now.
          </p>
        )}

      {/* stats */}
      <div className="mb-10 animate-fade-up stagger-2">
        <StatRow items={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isProvider && (
            <Panel
              title="My Services"
              action="Manage"
              actionTo="/dashboard/services"
              className="animate-fade-up stagger-2"
            >
              {loading ? (
                <Skeleton />
              ) : services.length === 0 ? (
                <Empty>
                  No services yet.{" "}
                  <Link
                    to="/dashboard/services/create"
                    className="text-sky-700 hover:underline"
                  >
                    Create your first one
                  </Link>
                </Empty>
              ) : (
                services
                  .slice(0, 4)
                  .map((service) => (
                    <Row
                      key={service.id}
                      to={`/provider/service/${service.id}`}
                      title={service.title}
                      meta={
                        service.type === "timeline" ? "Timeline" : "One-time"
                      }
                      right={<StatusDot status={service.status} />}
                    />
                  ))
              )}
            </Panel>
          )}

          {!isAdmin && (
            <Panel
              title={role === "client" ? "Orders" : "Incoming Orders"}
              action="View all"
              actionTo="/dashboard/orders"
              className="animate-fade-up stagger-3"
            >
              {loading ? (
                <Skeleton />
              ) : plainOrders.length === 0 ? (
                <Empty>
                  {role === "client"
                    ? "No orders yet. Browse services to get started."
                    : "No incoming orders yet."}
                </Empty>
              ) : (
                plainOrders
                  .slice(0, 5)
                  .map((order) => (
                    <OrderRow key={order.orderId} order={order} />
                  ))
              )}
            </Panel>
          )}

          {!isAdmin && (
            <Panel title="Coming Events" className="animate-fade-up stagger-4">
              {loading ? (
                <Skeleton />
              ) : upcomingEvents.length === 0 ? (
                <Empty>No upcoming events on your timelines.</Empty>
              ) : (
                upcomingEvents
                  .slice(0, 4)
                  .map((event) => (
                    <EventRow key={event.timelineId} event={event} />
                  ))
              )}
            </Panel>
          )}

          {isAdmin && (
            <Panel
              title="Platform"
              action="Open dashboard"
              actionTo="/dashboard"
              className="animate-fade-up stagger-3"
            >
              {loading ? (
                <Skeleton />
              ) : (
                <div className="grid grid-cols-2 gap-x-8">
                  <Row
                    title={adminStats?.services?.totalLiveServices ?? "—"}
                    meta="Live services"
                  />
                  <Row
                    title={adminStats?.services?.totalPendingServices ?? "—"}
                    meta="Pending approval"
                  />
                  <Row
                    title={`€${(adminStats?.finance?.escrow ?? 0).toFixed(2)}`}
                    meta="In escrow"
                  />
                  <Row
                    title={adminStats?.finance?.disputes ?? "—"}
                    meta="Open disputes"
                  />
                </div>
              )}
            </Panel>
          )}

          {isAdmin && pendingRequests.length > 0 && (
            <Panel
              title="Verification Queue"
              action="Review all"
              actionTo={
                role === "super_admin"
                  ? "/dashboard/service-providers/verification"
                  : "/dashboard"
              }
              className="animate-fade-up stagger-4"
            >
              {pendingRequests.slice(0, 4).map((request) => (
                <RequestRow key={request.id} request={request} />
              ))}
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          {(chats.length > 0 || (!loading && role === "client")) && (
            <Panel
              title="Messages"
              action="View all"
              actionTo="/dashboard/messages"
              className="animate-fade-up stagger-4"
            >
              {loading ? (
                <Skeleton />
              ) : chats.length === 0 ? (
                <Empty>No conversations yet.</Empty>
              ) : (
                chats
                  .slice(0, 3)
                  .map((chat) => <ChatRow key={chat.id} chat={chat} />)
              )}
            </Panel>
          )}

          <Panel
            title="Notifications"
            action="View all"
            actionTo="/dashboard/notifications"
            className="animate-fade-up stagger-5"
          >
            {loading ? (
              <Skeleton />
            ) : notifications.length === 0 ? (
              <Empty>No notifications.</Empty>
            ) : (
              notifications
                .slice(0, 4)
                .map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                  />
                ))
            )}
          </Panel>

          {role === "client" && (
            <Panel
              title="Favorites"
              action="View all"
              actionTo="/dashboard/favorite"
              className="animate-fade-up stagger-6"
            >
              {(profile?.favorites?.length || 0) === 0 ? (
                <Empty>No favorite services yet.</Empty>
              ) : (
                profile.favorites
                  .slice(0, 4)
                  .map((favorite) => (
                    <Row
                      key={favorite.id}
                      to={`/service/${favorite.service?.id}`}
                      title={favorite.service?.title || "Service"}
                      meta={
                        favorite.service?.type === "timeline"
                          ? "Timeline"
                          : "One-time"
                      }
                      right={
                        favorite.service?.rating != null
                          ? `★ ${Number(favorite.service.rating).toFixed(1)}`
                          : null
                      }
                    />
                  ))
              )}
            </Panel>
          )}

          {isProvider && (
            <Panel
              title="Finance"
              action="Open"
              actionTo="/dashboard/finance"
              className="animate-fade-up stagger-6"
            >
              {finance ? (
                <>
                  <Row
                    title={`€${(finance.balance ?? 0).toFixed(2)}`}
                    meta="Available balance"
                  />
                  <Row
                    title={`€${(finance.escrow ?? 0).toFixed(2)}`}
                    meta="In escrow"
                  />
                  <Row
                    title={`€${(finance.grossTotal ?? 0).toFixed(2)}`}
                    meta="Gross total"
                  />
                  <Row title={finance.disputes ?? "0"} meta="Disputes" />
                </>
              ) : (
                <Empty>Finance figures are not available.</Empty>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
