import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Archive,
  LayoutGrid,
  Calendar,
  Signpost,
  Eye,
  Users,
  Timer,
} from "lucide-react";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import FilterContainer from "../../../../components/ui/dashboard/FilterContainer";
import serviceProviderApis, {
  archiveTimeline,
  createNewPost,
  createNewTimeline,
} from "../../../../api/serviceProviderApis";
import StatusModal from "../../../../components/ui/StatusModal";
import PostCreationModal from "../../../../components/ui/dashboard/PostCreationModal";
import TimelineCreationModal from "../../../../components/ui/dashboard/TimelineCreationModal";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../api/errorMessages";

const getServiceStatus = (service) => {
  const { status, isPaused } = service;
  if (isPaused)
    return {
      label: "Paused",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500",
    };

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
    default:
      return {
        label: "Draft",
        color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        dot: "bg-zinc-400",
      };
  }
};

export default function ServiceProviderTimelines() {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusModalCon, setStatusModalCon] = useState(null);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);
  const [addingNewTimelineId, setAddingNewTimelineId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "timeline",
    title: "",
  });
  const navigate = useNavigate();

  const fetchGroupedData = useCallback(async () => {
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
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGroupedData();
  }, [fetchGroupedData]);

  // Handle Post Creation (Updates for a specific timeline)
  const handlePostCreation = async (payload) => {
    try {
      await createNewPost({
        timelineId: selectedTimelineId,
        description: payload.description,
        isPinned: payload.isPinned,
      });
      setSelectedTimelineId(null);
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Update posted successfully.",
      });
      // Note: Posts usually don't affect the table view directly, but we refresh to be sure
      fetchGroupedData();
    } catch (error) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };

  // Handle Timeline Creation with Optimistic Update
  const handleTimelineCreation = async (payload) => {
    const serviceId = addingNewTimelineId;
    try {
      const response = await createNewTimeline({ ...payload, serviceId });
      const newTimeline = response?.data || {
        ...payload,
        id: Math.random().toString(36).substr(2, 4),
      };

      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                timelines: {
                  ...s.timelines,
                  timelines: [...(s.timelines?.timelines || []), newTimeline],
                },
              }
            : s,
        ),
      );

      setAddingNewTimelineId(null);
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Timeline branch created.",
      });
    } catch (error) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };
  const executeArchive = async (timelineId, serviceId) => {
    try {
      await archiveTimeline(timelineId);
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                timelines: {
                  ...s.timelines,
                  timelines: s.timelines.timelines.filter(
                    (t) => t.id !== timelineId,
                  ),
                },
              }
            : s,
        ),
      );
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Timeline archived.",
      });
    } catch (error) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(error),
      });
    }
  };
  const handleArchiveRequest = async (timelineId, serviceId) => {
    setStatusModalCon({
      isOpen: true,
      type: "operation",
      message:
        "Archive this tier? It will be removed from your catalog and customer view.",
      onConfirm: () => executeArchive(timelineId, serviceId),
      onClose: () => setStatusModalCon(null),
    });
  };

  const groupedColumns = useMemo(
    () => [
      {
        header: "Service Group",
        render: (service) => (
          <TransactionCell
            title={service.title}
            subtext={`${service.category} • ${service.timelines?.timelines?.length || 0} Branches`}
            icon={LayoutGrid}
          />
        ),
      },
      {
        header: "Timeline Branches",
        render: (service) => (
          <div className="flex flex-col gap-3 py-4 min-w-[400px]">
            {service.timelines?.timelines?.map((timeline) => (
              <div
                key={timeline.id}
                className="group relative p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:border-blue-400 transition-all mb-3 last:mb-0 shadow-sm"
              >
                {/* Header: Identity & Price */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[11px] font-bold uppercase text-zinc-800 dark:text-zinc-100 tracking-tight leading-none">
                      {timeline.label}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                        ID: {timeline.id}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-zinc-300" />
                      <div className="flex items-center gap-1">
                        <Users size={10} className="text-zinc-400" />
                        <span className="text-[9px] font-bold text-zinc-500">
                          {timeline.maxParticipants || "∞"} Spots
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[13px] font-black italic text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-500/20">
                    ${timeline.price}
                  </span>
                </div>

                {/* Compact Date Chips - Light Tints */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {/* Deadline Chip */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                    <Timer size={11} className="text-amber-500" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[7px] font-bold uppercase text-amber-600 mb-0.5">
                        Registration
                      </span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                        {new Date(timeline.deadlineDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Start Chip */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                    <Calendar size={11} className="text-emerald-500" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[7px] font-bold uppercase text-emerald-600 mb-0.5">
                        Starts
                      </span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                        {new Date(timeline.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* End Chip */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl">
                    <div className="flex flex-col leading-none">
                      <span className="text-[7px] font-bold uppercase text-zinc-500 mb-0.5">
                        Ends
                      </span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                        {new Date(timeline.endDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Strip - Clear & Oriented */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-zinc-100 dark:border-white/5">
                  <button
                    onClick={() => setSelectedTimelineId(timeline.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold uppercase shadow-sm shadow-blue-200 transition-all active:scale-95"
                  >
                    <Signpost size={12} strokeWidth={2.5} /> Post Update
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/provider/timeline/${timeline.id}`)
                    }
                    className="p-2 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white dark:hover:text-zinc-900 rounded-xl transition-all"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() =>
                      handleArchiveRequest(timeline.id, service.id)
                    }
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    title="Archive"
                  >
                    <Archive size={14} />
                  </button>
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
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${status.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className="text-[10px] font-black uppercase">
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
                label: "Add Timeline",
                show: true,
                onClick: () => setAddingNewTimelineId(service.id),
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
        title="Timeline Management"
        subtitle="Control scheduling, registration deadlines, and branches"
      />
      <FilterContainer
        searchValue={filters.title}
        onSearchChange={(val) =>
          setFilters((p) => ({ ...p, title: val, page: 1 }))
        }
      />
      <MultiUseTable
        columns={groupedColumns}
        data={services}
        loading={loading}
        pagination={meta}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />
      <StatusModal
        {...statusModalCon}
        onClose={() => setStatusModalCon(null)}
      />
      <PostCreationModal
        isOpen={selectedTimelineId !== null}
        onSubmit={handlePostCreation}
        onClose={() => setSelectedTimelineId(null)}
      />
      <TimelineCreationModal
        isOpen={addingNewTimelineId !== null}
        onSubmit={handleTimelineCreation}
        onClose={() => setAddingNewTimelineId(null)}
      />
    </div>
  );
}
