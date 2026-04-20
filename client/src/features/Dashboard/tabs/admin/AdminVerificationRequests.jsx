import React, { useEffect, useState, useCallback } from "react";
import {
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";

// Standard UI Components from your project
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import FilterContainer, {
  FilterToggle,
} from "../../../../components/ui/dashboard/FilterContainer";
import StatusModal from "../../../../components/ui/StatusModal";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";

// API & Utils
import adminApis from "../../../../api/adminApis";
import { getErrorMessage } from "../../../../api/errorMessages";
import { useNavigate } from "react-router-dom";
import { useMeta } from "../../../../contexts/MetadataContext";

/* ---------------- MAIN COMPONENT ---------------- */

export default function AdminVerificationManager() {
  const [requests, setRequests] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null); // To show loading on specific actions
  const [statusModalCon, setStatusModalCon] = useState(null);
  const { categories } = useMeta();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined,
    type: undefined,
  });

  const navigate = useNavigate();

  /* ---------------- DATA FETCHING ---------------- */

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
      );

      const response = await adminApis.getAllRequests(cleanParams);

      if (response) {
        setRequests(response.data || []);
        setMeta(response.meta || { page: 1, totalPages: 1, total: 0 });
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
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
      page: key === "page" ? value : 1, // Reset to page 1 on filter change
    }));
  };

  const handleUpdateStatus = async (id, status, note = "") => {
    setProcessingId(id);
    try {
      await adminApis.updateRequest(id, { status, adminNote: note });
      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: `Request successfully ${status}.`,
      });
      fetchRequests();
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(err),
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getCategory = (id) => {
    const cat = categories.find((i) => i.id === id);
    return cat ? cat.title : "unknown";
  };
  /* ---------------- TABLE COLUMNS ---------------- */

  const verificationColumns = [
    {
      header: "Request ",
      render: (req) => (
        <TransactionCell
          title={`Request ${req.id}`}
          subtext={`Provider: ${req.serviceProviderId}`}
          icon={ShieldCheck}
          variant={req.status === "rejected" ? "danger" : "default"}
        />
      ),
    },
    {
      header: "Verification Type",
      render: (req) => (
        <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-blue-500/5 text-blue-400 rounded-lg border border-blue-500/10 tracking-widest">
          {req.type} {req.relatedId && getCategory(req.relatedId)}
        </span>
      ),
    },
    {
      header: "Attachments",
      render: (req) => (
        <div className="flex items-center gap-2">
          {req.assets?.map((url, idx) => {
            const isPdf = url.toLowerCase().includes(".pdf");
            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 hover:border-blue-500/50 transition-all group"
                title={isPdf ? "Open Document" : "Open Image"}
              >
                {isPdf ? (
                  <FileText size={16} className="text-purple-400" />
                ) : (
                  <ImageIcon size={16} className="text-blue-400" />
                )}
              </a>
            );
          })}
          {(!req.assets || req.assets.length === 0) && (
            <span className="text-[10px] text-zinc-600 font-bold uppercase italic">
              No Assets
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      render: (req) => {
        const statusMap = {
          pending: {
            color: "text-amber-500",
            dot: "bg-amber-500",
            label: "Review Required",
          },
          adminRequest: {
            color: "text-amber-500",
            dot: "bg-amber-500",
            label: "Admin requested changes",
          },
          approved: {
            color: "text-emerald-500",
            dot: "bg-emerald-500",
            label: "Approved",
          },
          rejected: {
            color: "text-red-500",
            dot: "bg-red-500",
            label: "Rejected",
          },
        };
        const s = statusMap[req.status] || statusMap.pending;
        return (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border border-current bg-transparent w-fit ${s.color} opacity-90`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {s.label}
            </span>
          </div>
        );
      },
    },
    {
      header: "Action",
      align: "right",
      render: (req) => {
        if (processingId === req.id)
          return (
            <Loader2 className="animate-spin text-zinc-500 mr-4" size={20} />
          );

        return (
          <ActionGroup
            actions={[
              {
                label: "NOTES",
                show: Boolean(req.adminNote),
                onClick: () =>
                  setStatusModalCon({
                    isOpen: true,
                    type: "info",
                    message: req.adminNote
                      ? req.adminNote
                      : "No Notes Available",
                  }),
                variant: "default",
              },
              {
                label: "leave a note",
                show: req.status === "pending" || req.status === "adminRequest",
                onClick: () =>
                  setStatusModalCon({
                    isOpen: true,
                    type: "input",
                    message: "Leave a note",
                    buttonText: "Submit",
                    showInput: true,
                    inputPlaceholder: req.adminNote
                      ? req.adminNote
                      : "Submit a note",
                    onConfirm: (note) =>
                      handleUpdateStatus(req.id, "adminRequest", note),
                    onClose: setStatusModalCon(null),
                  }),
                variant: "alert",
              },
              {
                label: "APPROVE",
                show: req.status === "pending" || req.status === "adminRequest",
                onClick: () => handleUpdateStatus(req.id, "approved"),
                variant: "success",
              },
              {
                label: "REJECT",
                show: req.status === "pending" || req.status === "adminRequest",
                onClick: () => {
                  setStatusModalCon({
                    isOpen: true,
                    type: "input",
                    message:
                      "Please provide a reason for rejecting this verification request.",
                    buttonText: "Confirm Rejection",
                    showInput: true,
                    onConfirm: (note) =>
                      handleUpdateStatus(req.id, "rejected", note),
                  });
                },
                variant: "danger",
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="max-w-8xl mx-auto space-y-6 p-6">
      <DashboardHeader
        title="Verification Center"
        subtitle="Review and manage service provider compliance requests"
      />

      <FilterContainer hideSearch={true}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-zinc-500 ml-2">
            Type:
          </span>
          <select
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 ring-blue-500/20 transition-all"
          >
            <option value="">All Verification Types</option>
            <option value="identity">Identity</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Status Filter Toggles */}
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          {["pending", "approved", "rejected"].map((stat) => (
            <FilterToggle
              key={stat}
              label={stat}
              active={filters.status === stat}
              variant={stat === "rejected" ? "red" : "emerald"}
              onClick={() =>
                handleFilterChange(
                  "status",
                  filters.status === stat ? undefined : stat,
                )
              }
            />
          ))}
        </div>
      </FilterContainer>

      <div className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
        <MultiUseTable
          columns={verificationColumns}
          data={requests}
          loading={loading}
          pagination={meta}
          onPageChange={(newPage) => handleFilterChange("page", newPage)}
        />
      </div>

      <StatusModal
        {...statusModalCon}
        onClose={() => setStatusModalCon(null)}
      />
    </div>
  );
}
