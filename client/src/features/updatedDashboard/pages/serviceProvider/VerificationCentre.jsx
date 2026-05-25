import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  User,
  Building2,
  LayoutGrid,
  Award,
  HelpCircle,
} from "lucide-react";
import { useMeta } from "../../../../contexts/MetadataContext";
import DocumentSegment from "./components/DocumentSegment";
import VerificationRequestModal from "./components/VerificationRequestModal";
import {
  fetchRequests,
  uploadVerificationFile,
} from "../../../../api/publicApis";

const TAB_CONFIG = [
  { id: "profile", label: "Profile Verification", icon: User },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "badges", label: "Badges", icon: Award },
];

let requestCache = null;

export default function SPVerificationCentre() {
  const { availableCategoryTypes = [], availableIdentityTypes = [] } =
    useMeta();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // 1. Array initialized dynamically from the clean API endpoint response structure
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "category",
    mode: "request",
    id: null,
    status: null,
  });

  const loadVerificationData = async (force = false) => {
    // Return local cache immediately if data has already been fetched inside this instance lifetime
    if (requestCache && !force) {
      setRequests(requestCache);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchRequests();
      if (response.success && response.data) {
        requestCache = response.data;
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Failed to load verification status payloads:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Safely trigger real fetch requests inside mount cycles
  useEffect(() => {
    loadVerificationData();
  }, []); // Safe dependency lock to execute exactly once

  const categoryMetaMap = useMemo(
    () => new Map((availableCategoryTypes || []).map((c) => [c.id, c])),
    [availableCategoryTypes],
  );

  // 3. Compute structural Identity & Business maps cleanly handling the multi-asset matrices
  const { personalDocs, businessDocs } = useMemo(() => {
    const personal = [];
    const business = [];

    (availableIdentityTypes || []).forEach((meta) => {
      // Find request wrapper checking cross-match targets
      const request = requests.find(
        (r) => r.type === "identity" && r.relatedId === meta.id,
      );

      const docItem = {
        id: meta.id,
        title: meta.label || meta.title,
        subtitle:
          meta.requirements && meta.requirements.length > 0
            ? `Accepted: ${Array.isArray(meta.requirements) ? meta.requirements.join(" · ") : meta.requirements}`
            : meta.label || meta.subtitle,
        status: request?.status || "not-uploaded",
        icon: meta.icon,
        required: true,
        assets: request?.assets || [], // Raw Multi-Asset Array passed down to UI sections
        expDate: request?.expDate || null,
        reason: request?.adminNote || null,
      };

      const isBus = ["businessregistration", "business registration"].includes(
        meta.title?.toLowerCase() || "",
      );
      if (isBus) {
        business.push(docItem);
      } else {
        personal.push(docItem);
      }
    });

    return { personalDocs: personal, businessDocs: business };
  }, [availableIdentityTypes, requests]);

  // 4. Compute active user category access requests mapping asset lists
  const userCategories = useMemo(() => {
    return requests
      .filter((r) => r.type === "category")
      .map((req) => {
        const meta = categoryMetaMap.get(req.relatedId);
        return {
          id: req.relatedId,
          title: meta?.label || meta?.title || "Unknown Category",
          subtitle:
            meta?.requirements && meta.requirements.length > 0
              ? `Accepted: ${Array.isArray(meta.requirements) ? meta.requirements.map((r) => r.title || r).join(" · ") : meta.requirements}`
              : meta?.label || meta?.title || "Category Credentials",
          icon: meta?.icon || "📁",
          status: req.status,
          assets: req.assets || [],
          expDate: req.expDate || null,
          reason: req.adminNote || null,
        };
      });
  }, [requests, categoryMetaMap]);

  const getCategoryRequestStatus = (catId) =>
    requests.find((r) => r.type === "category" && r.relatedId === catId)
      ?.status || null;
  const isCategoryRequested = (catId) =>
    requests.some((r) => r.type === "category" && r.relatedId === catId);

  const getStatusBadge = (status) => {
    const systems = {
      approved: {
        bg: "bg-emerald-100",
        color: "text-emerald-600",
        label: "Verified",
      },
      pending: {
        bg: "bg-amber-100",
        color: "text-amber-600",
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100",
        color: "text-red-600",
        label: "Rejected",
      },
    };
    return (
      systems[status] || {
        bg: "bg-gray-100",
        color: "text-gray-500",
        label: "Unknown",
      }
    );
  };

  const handleOpenModal = ({ type, mode, id, status }) => {
    setModalConfig({ type, mode, id, status });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async ({ type, relatedId, files }) => {
    if (!relatedId || !files || files.length === 0) return;

    const fd = new FormData();
    fd.append("type", type);
    fd.append("relatedId", relatedId);

    files.forEach((file) => {
      fd.append("files", file);
    });

    try {
      setLoading(true);
      const res = await uploadVerificationFile(fd);
      if (res.success) {
        await loadVerificationData(true);
      }
    } catch (err) {
      console.error(`${type} request failed:`, err);
      alert(`Failed to submit ${type} request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = useMemo(() => {
    const total = requests.filter((r) => r.status === "pending").length;
    return total > 0 ? `${total} Pending` : "Clear";
  }, [requests]);

  if (loading && requests.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-gray-500">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="animate-[fadeUp_0.3s_ease_both]">
      {/* Search Layout Box */}
      <div className="flex items-center gap-[7px] bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-2 mb-4">
        <Search size={13} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search items…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent text-[13px] text-[#0a0f1e] w-full outline-none"
        />
      </div>

      {/* Navigation Layout */}
      <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-3 bg-[#ebf0ff] border border-[#e0e7ff] rounded-lg p-0.5">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer ${
                isActive
                  ? "bg-white text-[#024CEE] shadow-sm font-semibold"
                  : "text-gray-500 bg-transparent"
              }`}
            >
              <Icon size={13} />
              {tab.label}
              {tab.id === "profile" && (
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${pendingCount.includes("Pending") ? "bg-amber-200/50 text-amber-600" : "bg-emerald-100/50 text-emerald-600"}`}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Workspace Context Elements */}
      <div>
        {activeTab === "profile" && (
          <div className="animate-[fadeUp_0.5s_ease_both]">
            <div className="flex items-start gap-2 bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-3 mb-3.5 text-xs text-gray-500">
              <HelpCircle
                size={13}
                className="text-[#024CEE] shrink-0 mt-0.5"
              />
              <span>
                Accepted verification formats:{" "}
                <strong className="text-[#0a0f1e]">
                  PDF · JPG · PNG · WEBP
                </strong>
              </span>
            </div>
            <DocumentSegment
              title="Identity Documents"
              subtitle="Government ID, Proof of Residence"
              icon={User}
              iconBgColor="bg-red-50"
              iconTextColor="text-red-600"
              documents={personalDocs}
              onUploadTrigger={(doc) =>
                handleOpenModal({
                  type: "identity",
                  mode: "request",
                  id: doc.id,
                  status: doc.status,
                })
              }
              gridCols="grid-cols-1"
            />
            <DocumentSegment
              title="Business Registration"
              subtitle="Commercial license, Freelance permit"
              icon={Building2}
              iconBgColor="bg-blue-50"
              iconTextColor="text-[#024CEE]"
              documents={businessDocs}
              onUploadTrigger={(doc) =>
                handleOpenModal({
                  type: "identity",
                  mode: "request",
                  id: doc.id,
                  status: doc.status,
                })
              }
              gridCols="grid-cols-1"
            />
          </div>
        )}

        {activeTab === "categories" && (
          <div className="animate-[fadeUp_0.5s_ease_both]">
            <DocumentSegment
              title="My Service Categories"
              subtitle="Active and pending categories"
              icon={LayoutGrid}
              iconBgColor="bg-blue-50"
              iconTextColor="text-[#024CEE]"
              documents={userCategories}
              onUploadTrigger={(doc) =>
                handleOpenModal({
                  type: "category",
                  mode: doc.id ? "info" : "request",
                  id: doc.id,
                  status: doc.status,
                })
              }
              gridCols="grid-cols-2"
              isCategorySegment={true}
            />

            <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col gap-1.5">
                  {availableCategoryTypes.map((cat) => {
                    const status = getCategoryRequestStatus(cat.id);
                    const isRequested = isCategoryRequested(cat.id);
                    const badge = status ? getStatusBadge(status) : null;

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center gap-2.5 px-3 py-2 border border-[#e0e7ff] rounded-lg"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="text-[12.5px] font-medium text-[#0a0f1e]">
                            {cat.title || cat.label}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {cat.categoryType || ""}
                          </div>
                        </div>
                        {badge && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            handleOpenModal({
                              type: "category",
                              mode: isRequested ? "info" : "request",
                              id: cat.id,
                              status: status,
                            })
                          }
                          className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#024CEE] border-none cursor-pointer hover:bg-blue-100"
                        >
                          {isRequested ? "View" : "Request"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <VerificationRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalConfig.type}
        mode={modalConfig.mode}
        preselectedId={modalConfig.id}
        requestStatus={modalConfig.status}
        onSubmit={handleModalSubmit}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`,
        }}
      />
    </div>
  );
}
