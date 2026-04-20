import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Box,
  Search,
  PauseCircle,
  PlayCircle,
  FileEdit,
} from "lucide-react";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import StatusModal from "../../../../components/ui/StatusModal";
import serviceProviderApis from "../../../../api/serviceProviderApis";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";
import { getErrorMessage } from "../../../../api/errorMessages";
import { useNavigate } from "react-router-dom";

/**
 * Standardized Status Helper
 * Matches Admin logic for visual consistency
 */
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
        label: "Live",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        dot: "bg-emerald-500 animate-pulse",
        icon: CheckCircle2,
      };
    case "pending":
      return {
        label: "Pending Review",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        dot: "bg-amber-500",
        icon: Clock,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        dot: "bg-red-500",
        icon: AlertCircle,
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
        label: "Unknown",
        color: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
        dot: "bg-zinc-300",
        icon: Clock,
      };
  }
};

export default function ServiceProviderServices() {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusModalCon, setStatusModalCon] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    title: "",
    status: undefined,
    isPaused: undefined,
  });

  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
      );
      const response = await serviceProviderApis.getAllServices(cleanParams);
      if (response) {
        setServices(response.data || []);
        setMeta({
          page: response.page || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
        });
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setStatusModalCon({
        isOpen: true,
        type: "error",
        onClose: () => setStatusModalCon(null),
        message: message,
        buttonText: "Retry",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleTogglePause = async (id, currentIsPaused) => {
    const targetAction = currentIsPaused ? "resume" : "pause";
    try {
      await serviceProviderApis.pauseResumeService(id, targetAction);

      // OPTIMISTIC STATE PATCH
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isPaused: !currentIsPaused } : s,
        ),
      );
    } catch (error) {
      const message = getErrorMessage(error);
      setStatusModalCon({
        isOpen: true,
        type: "error",
        onClose: () => setStatusModalCon(null),
        message: message,
        buttonText: "Retry",
      });
    }
  };

  const handleRequestApproval = async (id) => {
    try {
      await serviceProviderApis.requestApproval(id);

      // OPTIMISTIC STATE PATCH
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "pending" } : s)),
      );

      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Service submitted for admin review.",
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setStatusModalCon({
        isOpen: true,
        type: "error",
        onClose: () => setStatusModalCon(null),
        message: message,
        buttonText: "Retry",
      });
    }
  };

  const handleViewRejection = (reason) => {
    setStatusModalCon({
      isOpen: true,
      type: "info",
      title: "Rejection Details",
      message: reason || "No specific reason provided by the administrator.",
      buttonText: "Understood",
      onClose: () => setStatusModalCon(null),
    });
  };

  const serviceColumns = useMemo(
    () => [
      {
        header: "Service",
        render: (service) => (
          <TransactionCell
            title={service.title}
            subtext={`${service.category || "Service"} • ID: ${service.id}`}
            icon={Box}
          />
        ),
      },
      {
        header: "Platform Status",
        render: (service) => {
          const status = getServiceStatus(service);
          return (
            <div className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                <span className="text-[10px] font-black uppercase tracking-tight">
                  {status.label}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Performance",
        render: (service) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-sm font-black italic">
              <Eye size={12} className="text-zinc-400" />
              {service.views || 0}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase">
              <span className="text-amber-500">{service.rating || 0} ★</span>
              <span>•</span>
              <span>{service.totalReviews || 0} Reviews</span>
            </div>
          </div>
        ),
      },
      {
        header: "Action",
        align: "right",
        render: (service) => (
          <ActionGroup
            actions={[
              {
                label: "Request Approval",
                show:
                  service.status === "draft" || service.status === "rejected",
                onClick: () => handleRequestApproval(service.id),
                variant: "emerald",
              },
              {
                label: "View Reason",
                show: !!service.rejectionReason,
                onClick: () => handleViewRejection(service.rejectionReason),
                variant: "outline",
              },
              {
                label: service.isPaused ? "Resume" : "Pause",
                show: service.status === "approved",
                onClick: () => handleTogglePause(service.id, service.isPaused),
                variant: service.isPaused ? "success" : "danger",
              },
              {
                label: "Edit",
                show:
                  service.status === "draft" || service.status === "rejected",
                onClick: () =>
                  navigate(`/dashboard/services/create?id=${service.id}`),
                variant: "outline",
              },
              {
                label: "View",
                onClick: () => navigate(`/provider/service/${service.id}`),
                variant: "outline",
              },
            ]}
          />
        ),
      },
    ],
    [navigate, services],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <DashboardHeader
        title={"My Services"}
        subtitle={"Manage your catalog and track performance"}
      />

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 ring-blue-500/20 transition-all"
              value={filters.title}
              onChange={(e) =>
                setFilters((p) => ({ ...p, title: e.target.value, page: 1 }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterToggleChip
              label="All"
              active={filters.status === undefined}
              onClick={() =>
                setFilters((p) => ({ ...p, status: undefined, page: 1 }))
              }
            />
            <FilterToggleChip
              label="Live"
              variant="emerald"
              active={filters.status === "approved"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "approved", page: 1 }))
              }
            />
            <FilterToggleChip
              label="Pending"
              variant="amber"
              active={filters.status === "pending"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "pending", page: 1 }))
              }
            />
            <FilterToggleChip
              label="Rejected"
              variant="red"
              active={filters.status === "rejected"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "rejected", page: 1 }))
              }
            />
            <FilterToggleChip
              label="Drafts"
              active={filters.status === "draft"}
              onClick={() =>
                setFilters((p) => ({ ...p, status: "draft", page: 1 }))
              }
            />

            <div className="w-[1px] h-6 bg-zinc-200 dark:bg-white/10 mx-1 hidden md:block" />

            <FilterToggleChip
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
          columns={serviceColumns}
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

const FilterToggleChip = ({ label, active, onClick, variant = "default" }) => {
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
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-transparent transition-all duration-200 ${variants[variant] || variants.default} ${!active && "border-zinc-100 dark:border-white/5"}`}
    >
      {label}
    </button>
  );
};
