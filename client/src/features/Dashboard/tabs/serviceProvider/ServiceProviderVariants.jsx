import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Archive, Package, Plus } from "lucide-react";
import { getErrorMessage } from "../../../../api/errorMessages";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import FilterContainer from "../../../../components/ui/dashboard/FilterContainer";
import serviceProviderApis, {
  archiveVariant,
  createNewVariant,
} from "../../../../api/serviceProviderApis";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";
import VariantsCreationModal from "../../../../components/ui/dashboard/VariantsCreationModal";
import StatusModal from "../../../../components/ui/StatusModal";
import { useNavigate } from "react-router-dom";

/**
 * Standardized Status Helper
 * Matches your Service Management logic exactly
 */
const getServiceStatus = (service) => {
  const { status, isPaused } = service;

  if (isPaused) {
    return {
      label: "Paused",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500",
    };
  }

  switch (status) {
    case "approved":
      return {
        label: "Live",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        dot: "bg-emerald-500 animate-pulse",
      };
    case "pending":
      return {
        label: "Pending Review",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        dot: "bg-amber-500",
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        dot: "bg-red-500",
      };
    case "draft":
      return {
        label: "Draft",
        color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        dot: "bg-zinc-400",
      };
    default:
      return {
        label: "Unknown",
        color: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
        dot: "bg-zinc-300",
      };
  }
};

export default function ServiceProviderVariants() {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [newVariantServiceId, setNewVariantServiceId] = useState(null);
  const [statusModalCon, setStatusModalCon] = useState(null);

  // RESTORED: type: "oneTime" filter
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "oneTime",
    title: "",
  });

  const navigate = useNavigate();

  const fetchVariantsData = useCallback(async () => {
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
    fetchVariantsData();
  }, [fetchVariantsData]);

  const handleVariantCreation = async (payload) => {
    const serviceId = newVariantServiceId;
    try {
      const response = await createNewVariant({
        ...payload,
        serviceId,
      });

      // OPTIMISTIC PATCH (No refetch)
      const newVariant = response?.data || {
        ...payload,
        id: Date.now().toString(),
      };

      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                variants: {
                  ...s.variants,
                  variants: [...(s.variants?.variants || []), newVariant],
                },
              }
            : s,
        ),
      );

      setNewVariantServiceId(null);
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "New tier added successfully.",
      });
    } catch (e) {
      // PROPER ERROR HANDLING
      const message = getErrorMessage(e);
      setStatusModalCon({
        isOpen: true,
        type: "error",
        onClose: () => setStatusModalCon(null),
        message: message,
        buttonText: "Retry",
      });
    }
  };

  const executeArchive = async (variantId, serviceId) => {
    try {
      await archiveVariant(variantId);
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                variants: {
                  ...s.variants,
                  variants: s.variants.variants.filter(
                    (v) => v.id !== variantId,
                  ),
                },
              }
            : s,
        ),
      );
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Variant archived successfully.",
      });
    } catch (error) {
      // PROPER ERROR HANDLING
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

  const handleArchiveRequest = (variantId, serviceId) => {
    setStatusModalCon({
      isOpen: true,
      type: "operation",
      message:
        "Archive this tier? It will be removed from your catalog and customer view.",
      onConfirm: () => executeArchive(variantId, serviceId),
      onClose: () => setStatusModalCon(null),
    });
  };

  const variantColumns = useMemo(
    () => [
      {
        header: "Service",
        render: (service) => (
          <TransactionCell
            title={service.title}
            subtext={`${service.category || "Service"} • ${service.views || 0} Views`}
            icon={Package}
          />
        ),
      },
      {
        header: "Active Tiers",
        render: (service) => {
          const activeVariants =
            service.variants?.variants?.filter((v) => !v.isArchived) || [];
          return (
            <div className="flex flex-col gap-2 py-4 min-w-[280px]">
              {activeVariants.length > 0 ? (
                activeVariants.map((variant) => (
                  <div
                    key={variant.id}
                    className="group flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] hover:border-blue-500/30 transition-all shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-zinc-800 dark:text-zinc-200 leading-none mb-1">
                        {variant.label}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400">
                        {variant.deliveryTime} Day(s) Delivery
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-emerald-600">
                        ${variant.price}
                      </span>
                      <button
                        onClick={() =>
                          handleArchiveRequest(variant.id, service.id)
                        }
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Archive size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-zinc-400 italic px-2">
                  No active tiers configured
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Market Status",
        render: (service) => {
          const status = getServiceStatus(service);
          return (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${status.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {status.label}
              </span>
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
                label: "Add Tier",
                show: true,
                onClick: () => setNewVariantServiceId(service.id),
                variant: "emerald",
              },
              {
                label: "View",
                show: true,
                onClick: () => navigate(`/provider/service/${service.id}`),
                variant: "outline",
              },
            ]}
          />
        ),
      },
    ],
    [services, navigate],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <DashboardHeader
        title="Tier Management"
        subtitle="Control your pricing strategy and delivery times"
      />

      <VariantsCreationModal
        isOpen={newVariantServiceId !== null}
        onClose={() => setNewVariantServiceId(null)}
        onSubmit={handleVariantCreation}
      />

      <StatusModal
        {...statusModalCon}
        onClose={() => setStatusModalCon(null)}
      />

      <FilterContainer
        searchValue={filters.title}
        onSearchChange={(val) =>
          setFilters((prev) => ({ ...prev, title: val, page: 1 }))
        }
      />

      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm">
        <MultiUseTable
          columns={variantColumns}
          data={services}
          loading={loading}
          pagination={meta}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </div>
    </div>
  );
}
