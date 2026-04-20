import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  LayoutGrid,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  PauseCircle,
  FileEdit,
} from "lucide-react";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import StatusModal from "../../../../components/ui/StatusModal";
import adminApis, {
  getAllServicesStatistical,
} from "../../../../api/adminApis";
import MetricCard from "../../../../components/ui/dashboard/MetricCard";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";

const getServiceStatus = (service) => {
  const { status, isPaused } = service;

  if (isPaused) {
    return {
      label: "Paused",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500",
      icon: PauseCircle,
    };
  }

  switch (status) {
    case "approved":
      return {
        label: "Approved",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        dot: "bg-emerald-500",
        icon: ShieldCheck,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        dot: "bg-red-500",
        icon: ShieldAlert,
      };
    case "pending":
      return {
        label: "Pending Review",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        dot: "bg-amber-500 animate-pulse",
        icon: Clock,
      };
    case "draft":
      return {
        label: "Draft",
        color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        dot: "bg-zinc-400",
        icon: FileEdit,
      };
    default:
      return {
        label: status || "Unknown",
        color: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
        dot: "bg-zinc-300",
        icon: Clock,
      };
  }
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusModalCon, setStatusModalCon] = useState(null);
  const [metrics, setMetrics] = useState({
    totalServices: 0,
    totalLiveServices: 0,
    totalPendingServices: 0,
    totalRejectedServices: 0,
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    title: "",
    status: undefined,
    isPaused: undefined,
  });

  useEffect(() => {
    (async () => {
      try {
        const metricsRes = await getAllServicesStatistical();
        setMetrics(metricsRes.data);
      } catch (err) {
        console.error("Metrics Fetch Error:", err);
      }
    })();
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
      );
      const response = await adminApis.getAllServices(cleanParams);
      if (response && response.data) {
        setServices(response.data);
        setMeta({
          page: response.page || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const executeStatusUpdate = async (
    id,
    status,
    rejectionReason = undefined,
  ) => {
    try {
      await adminApis.updateServiceStatus(id, { status, rejectionReason });

      // OPTIMISTIC STATE PATCH
      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status,
                rejectionReason:
                  status === "approved"
                    ? null
                    : rejectionReason || s.rejectionReason,
              }
            : s,
        ),
      );

      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: `Service status updated to: ${status}.`,
        onClose: () => setStatusModalCon(null),
      });
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: err?.response?.data?.message || "Internal server error.",
        onClose: () => setStatusModalCon(null),
      });
    }
  };

  const handleViewRejection = (reason) => {
    setStatusModalCon({
      isOpen: true,
      type: "info",
      title: "Rejection History",
      message: reason || "No rejection reason provided.",
      buttonText: "Close",
      onClose: () => setStatusModalCon(null),
    });
  };

  const handleServiceRejection = async (id) => {
    setStatusModalCon({
      isOpen: true,
      type: "operation",
      message: `Please enter a reason for rejecting this service?`,
      showInput: true,
      inputPlaceholder: "Enter reason...",
      onConfirm: (reason) => executeStatusUpdate(id, "rejected", reason),
      onClose: () => setStatusModalCon(null),
    });
  };

  const handleUpdateClick = (id, status) => {
    setStatusModalCon({
      isOpen: true,
      type: "operation",
      message: `Are you sure you want to set this service to ${status}?`,
      buttonText: status === "approved" ? "Confirm Approval" : "Reject Service",
      onConfirm: () => executeStatusUpdate(id, status),
      onClose: () => setStatusModalCon(null),
    });
  };

  const adminColumns = useMemo(
    () => [
      {
        header: "Service & Provider",
        render: (service) => (
          <TransactionCell
            id={service.title || "Untitled Service"}
            title={service.title || "Untitled Service"}
            subtext={service.serviceProvider || "Unknown Provider"}
            icon={LayoutGrid}
          />
        ),
      },
      {
        header: "Inventory Details",
        render: (service) => (
          <div className="flex flex-col gap-2 py-2 min-w-[300px]">
            {service.type === "oneTime" &&
              service.variants?.variants?.map((v) => (
                <div
                  key={v.id}
                  className={`group flex items-center justify-between border p-2.5 rounded-xl transition-all duration-300 ${v.isArchived ? "bg-zinc-100/40 opacity-50 grayscale" : "bg-white dark:bg-white/[0.03] border-zinc-100 dark:border-white/10"}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg ${v.isArchived ? "bg-zinc-200" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      <Tag size={12} strokeWidth={2.5} />
                    </div>
                    <span
                      className={`text-[11px] font-black uppercase truncate ${v.isArchived ? "text-zinc-500 line-through" : "text-zinc-700 dark:text-zinc-300"}`}
                    >
                      {v.label}
                    </span>
                  </div>
                  {!v.isArchived && (
                    <div className="flex-1 mx-3 border-b border-dotted border-zinc-200 dark:border-zinc-800 mb-1" />
                  )}
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md border text-emerald-600 bg-emerald-50 border-emerald-100">
                    ${v.price}
                  </span>
                </div>
              ))}
            {service.type === "timeline" &&
              service.timelines?.timelines?.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col p-3 rounded-xl border bg-white dark:bg-white/[0.03] border-zinc-100 dark:border-white/10 shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-blue-600">
                      {t.label}
                    </span>
                    <span className="text-[10px] font-bold">${t.price}</span>
                  </div>
                  <div className="text-[9px] font-semibold text-zinc-400 mt-2 uppercase">
                    {new Date(t.startDate).toLocaleDateString()} —{" "}
                    {new Date(t.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        ),
      },
      {
        header: "Status",
        render: (service) => {
          const status = getServiceStatus(service);
          return (
            <div className="flex flex-col gap-1.5">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                <span className="text-[9px] font-black uppercase tracking-tight">
                  {status.label}
                </span>
              </div>
              {service.status === "rejected" && service.rejectionReason && (
                <span className="text-[10px] text-red-400 italic font-medium leading-tight max-w-[180px]">
                  Reason: {service.rejectionReason}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Action",
        align: "right",
        render: (service) => (
          <ActionGroup
            actions={[
              {
                label: "Approve",
                show: service.status === "pending",
                onClick: () => handleUpdateClick(service.id, "approved"),
                variant: "emerald",
              },
              {
                label: "Reject",
                show: service.status !== "draft",
                onClick: () => handleServiceRejection(service.id),
                variant: "outline",
              },
              {
                label: "History",
                show: !!service.rejectionReason,
                onClick: () => handleViewRejection(service.rejectionReason),
                variant: "outline",
              },
              {
                label: "View",
                show: true,
                onClick: () =>
                  window.open(`/admin/service/${service.id}`, "_blank"),
                variant: "outline",
              },
            ]}
          />
        ),
      },
    ],
    [services],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <DashboardHeader
        title={"Admin Services Console"}
        subtitle={"Audit Service"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Services"
          amount={metrics.totalServices}
          icon={Layers}
          variant="default"
        />
        <MetricCard
          title="Live Services"
          amount={metrics.totalLiveServices}
          icon={CheckCircle}
          variant="green"
        />
        <MetricCard
          title="Pending Review"
          amount={metrics.totalPendingServices}
          icon={Clock}
          variant="yellow"
          isCount
        />
        <MetricCard
          title="Rejected"
          amount={metrics.totalRejectedServices}
          icon={XCircle}
          variant="red"
        />
      </div>

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-100 dark:border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search services by title..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 ring-emerald-500/20 transition-all"
              value={filters.title}
              onChange={(e) =>
                setFilters((p) => ({ ...p, title: e.target.value, page: 1 }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterToggle
              label="All"
              active={filters.status === undefined}
              onClick={() =>
                setFilters((p) => ({ ...p, status: undefined, page: 1 }))
              }
            />
            <FilterToggle
              label="Pending"
              variant="amber"
              active={filters.status === "pending"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "pending", page: 1 }))
              }
            />
            <FilterToggle
              label="Approved"
              variant="emerald"
              active={filters.status === "approved"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "approved", page: 1 }))
              }
            />
            <FilterToggle
              label="Rejected"
              variant="red"
              active={filters.status === "rejected"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "rejected", page: 1 }))
              }
            />
            <FilterToggle
              label="Drafts"
              active={filters.status === "draft"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "draft", page: 1 }))
              }
            />

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-white/10 mx-1 hidden md:block" />

            <FilterToggle
              label="Paused"
              variant="amber"
              active={filters.isPaused === true}
              onClick={() =>
                setFilters((p) => ({
                  ...p,
                  isPaused: p.isPaused === true ? undefined : true,
                  page: 1,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-white/5 overflow-hidden">
        <MultiUseTable
          columns={adminColumns}
          data={services}
          loading={loading}
          pagination={meta}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </div>

      <StatusModal
        {...statusModalCon}
        onClose={() => setStatusModalCon(null)}
      />
    </div>
  );
}

const FilterToggle = ({ label, active, onClick, variant = "default" }) => {
  const variants = {
    default: active
      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5",
    emerald: active
      ? "bg-emerald-500 text-white border-emerald-500"
      : "text-zinc-500 hover:border-emerald-500/50",
    amber: active
      ? "bg-amber-500 text-white border-amber-500"
      : "text-zinc-500 hover:border-amber-500/50",
    red: active
      ? "bg-red-500 text-white border-red-500"
      : "text-zinc-500 hover:border-red-500/50",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-transparent transition-all duration-200 ${variants[variant]} ${!active && "border-zinc-100 dark:border-white/5"}`}
    >
      {label}
    </button>
  );
};
