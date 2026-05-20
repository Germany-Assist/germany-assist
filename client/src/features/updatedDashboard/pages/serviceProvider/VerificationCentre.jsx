import React, { useState, useRef } from "react";
import {
  AlertCircle,
  Search,
  User,
  Building2,
  LayoutGrid,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  X,
} from "lucide-react";
import DocumentSegment from "./components/DocumentSegment";
import UploadModal from "./components/UploadFileModal";

const categories = [
  {
    id: "german",
    name: "German Language",
    status: "active",
    subs: [
      "General German A1–C2",
      "Exam Prep Goethe",
      "Business German",
      "Online Courses",
    ],
  },
  {
    id: "coaching",
    name: "Career Coaching",
    status: "pending",
    subs: ["CV & Cover Letter", "LinkedIn Optimization", "Job Interview Prep"],
  },
  {
    id: "translation",
    name: "Translation Services",
    status: "active",
    subs: ["Sworn Translation", "Legal Translation", "Document Translation"],
  },
];

export default function SPVerificationCentre() {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabs, setTabs] = useState([
    {
      id: "profile",
      label: "Profile Verification",
      icon: User,
      badge: "i will check ",
      badgeType: "warn",
    },
    {
      id: "categories",
      label: "Categories",
      icon: LayoutGrid,
      badge: "i will check ",
      badgeType: "warn",
    },
    {
      id: "badges",
      label: "Badges",
      icon: Award,
      badge: "Coming soon",
      badgeType: "ok",
    },
  ]);

  const [requests, setRequests] = useState({
    identity: [
      {
        id: "personal-id",
        title: "Personal Identification",
        subtitle: "Passport or National ID • Freelancer & Company",
        status: "rejected",
        fileName: "passport_2024.pdf",
        required: true,
      },
      {
        id: "residence",
        title: "Proof of Residence",
        subtitle: "Utility bill or bank statement (last 3 months)",
        status: "rejected",
        reason: "document expired",
        required: true,
      },
    ],
    business: [
      {
        id: "business-reg",
        title: "Business Registration",
        subtitle: "Official commercial license • Company only",
        status: "pending",
        fileName: "business_reg.pdf",
        required: true,
      },
      {
        id: "freelance",
        title: "Freelance License",
        subtitle: "Valid professional permit • Freelancer only",
        status: "not-uploaded",
        required: false,
      },
    ],
  });

  // Modal Context State Trackers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState(null); // structure: { categoryKey: '', doc: {} }

  // Fired when clicking 'Upload' or 'Replace' inside a child segment block
  const handleOpenUploadModal = (categoryKey, doc) => {
    setModalContext({ categoryKey, doc });
    setIsModalOpen(true);
  };

  // Fired when file is securely staged inside the verification frame
  const handleConfirmUpload = (file) => {
    if (!modalContext || !file) return;

    const { categoryKey, doc } = modalContext;

    setRequests((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map((item) =>
        item.id === doc.id
          ? {
              ...item,
              fileName: file.name,
              status: "pending", // Flip to review pipeline status
              reason: null, // Discard historical failure reason strings
            }
          : item,
      ),
    }));
  };

  return (
    <div className="animate-[fadeUp_0.3s_ease_both]">
      {/* Universal Content Search Filter Bar */}
      <div className="flex items-center gap-[7px] bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-2 mb-4 max-w-full">
        <Search size={13} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search documents, categories, badges…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent text-[13px] text-[#0a0f1e] w-full outline-none font-['Outfit',sans-serif]"
        />
      </div>

      {/* Navigation Tab Selectors */}
      <div className="flex gap-[2px] bg-blue-50 rounded-lg p-[3px] mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-[12.5px] font-medium cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 select-none ${
                isActive
                  ? "bg-white text-[#024CEE] shadow-[0_1px_6px_rgba(2,76,238,0.10)] font-semibold"
                  : "text-gray-500"
              }`}
            >
              <Icon size={13} />
              {tab.label}
              <span
                className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${
                  tab.badgeType === "warn"
                    ? "bg-amber-200/50 text-amber-600"
                    : "bg-emerald-100/50 text-emerald-600"
                }`}
              >
                {tab.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Primary Context Section Panels */}
      <div className="animate-[fadeUp_0.25s_ease_both]">
        {activeTab === "profile" && (
          <div>
            <div className="flex items-start gap-2 bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-3 mb-3.5 text-xs text-gray-500">
              <HelpCircle
                size={13}
                className="text-[#024CEE] shrink-0 mt-0.5"
              />
              <span>
                Accepted formats:{" "}
                <strong className="text-[#0a0f1e] mx-1">PDF · JPG · PNG</strong>{" "}
                · Max 2 MB · English, German, or Arabic only
              </span>
            </div>

            {/* Identity Segment Row Card */}
            <DocumentSegment
              title="Identity Documents"
              subtitle="Government ID, Proof of Residence"
              categoryKey="identity"
              icon={User}
              iconBgColor="bg-red-50"
              iconTextColor="text-red-600"
              documents={requests.identity}
              onUploadTrigger={handleOpenUploadModal}
              gridCols="grid-cols-1"
            />

            {/* Business Registration Segment Row Card */}
            <DocumentSegment
              title="Business Registration"
              subtitle="Commercial license, Freelance permit, or School registration"
              categoryKey="business"
              icon={Building2}
              iconBgColor="bg-blue-50"
              iconTextColor="text-[#024CEE]"
              documents={requests.business}
              onUploadTrigger={handleOpenUploadModal}
              gridCols="grid-cols-2"
            />
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <div className="flex items-start gap-2 bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-3 mb-3.5 text-xs text-gray-500">
              <HelpCircle
                size={13}
                className="text-[#024CEE] shrink-0 mt-0.5"
              />
              <span>
                Select the service categories you operate in. Each category
                requires admin approval before you can publish services in it.
              </span>
            </div>

            <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#e0e7ff]">
                <div className="w-[30px] h-[30px] rounded-lg bg-blue-50 flex items-center justify-center">
                  <LayoutGrid size={15} className="text-[#024CEE]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#0a0f1e]">
                    My Service Categories
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Active and pending categories
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-[10px]">
                  {categories.map((cat) => {
                    const isActive = cat.status === "active";
                    return (
                      <div
                        key={cat.id}
                        className="border border-[#024CEE] rounded-lg p-3.5 transition-all cursor-pointer bg-blue-50/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center ${
                              isActive ? "bg-emerald-100" : "bg-amber-100"
                            }`}
                          >
                            <LayoutGrid
                              size={14}
                              className={
                                isActive ? "text-emerald-600" : "text-amber-600"
                              }
                            />
                          </div>
                          <span className="text-[12.5px] font-semibold text-[#0a0f1e] flex-1">
                            {cat.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {isActive ? "Active" : "Pending"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cat.subs.map((sub, idx) => (
                            <span
                              key={idx}
                              className={`text-[10.5px] px-1.5 py-0.5 rounded ${
                                isActive
                                  ? "bg-emerald-100/50 text-emerald-600"
                                  : "bg-amber-100/50 text-amber-600"
                              }`}
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-2 border-dashed border-blue-200/60 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center">
                      <Upload size={14} className="text-[#024CEE]" />
                    </div>
                    <div className="text-[12px] font-semibold text-[#024CEE]">
                      Add Category
                    </div>
                    <div className="text-[11px] text-gray-500 text-center">
                      Request access to a new service category
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#e0e7ff]">
                <div className="w-[30px] h-[30px] rounded-lg bg-gray-100 flex items-center justify-center">
                  <LayoutGrid size={15} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#0a0f1e]">
                    All Available Categories
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    8 main categories on Germany Assists
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-1.5">
                  {[
                    {
                      name: "German Language",
                      type: "Freelancer / School",
                      status: "active",
                      color: "#059669",
                    },
                    {
                      name: "Career Coaching",
                      type: "Freelancer / Company",
                      status: "pending",
                      color: "#D97706",
                    },
                    {
                      name: "Translation Services",
                      type: "Freelancer / Company",
                      status: "active",
                      color: "#059669",
                    },
                    {
                      name: "Certificate Recognition",
                      type: "Company only",
                      status: "inactive",
                      color: "#6b7280",
                    },
                    {
                      name: "Visa & Immigration",
                      type: "Freelancer / Company",
                      status: "inactive",
                      color: "#6b7280",
                    },
                    {
                      name: "Recruitment Services",
                      type: "Company / Freelancer",
                      status: "inactive",
                      color: "#6b7280",
                    },
                  ].map((cat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2 border border-[#e0e7ff] rounded-lg"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: cat.color }}
                      ></div>
                      <div className="flex-1 text-[12.5px] font-medium text-[#0a0f1e]">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {cat.type}
                      </div>
                      {cat.status === "active" && (
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-600">
                          Active
                        </span>
                      )}
                      {cat.status === "pending" && (
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-600">
                          Pending
                        </span>
                      )}
                      {cat.status === "inactive" && (
                        <button className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#024CEE] border-none cursor-pointer hover:bg-blue-100 transition-colors">
                          Request
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Embedded Document Upload Overlay Portal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentConfig={modalContext?.doc}
        onConfirmUpload={handleConfirmUpload}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
