import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Building2,
  LayoutGrid,
  Award,
  HelpCircle,
  Upload,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { fetchCategoriesForRegister } from "../../../../api/meta.api";
import DocumentSegment from "./components/DocumentSegment";
import UploadModal from "./components/UploadFileModal";

export default function SPVerificationCentre() {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = [
    {
      id: "profile",
      label: "Profile Verification",
      icon: User,
      badge: "i will check",
      badgeType: "warn",
    },
    {
      id: "categories",
      label: "Categories",
      icon: LayoutGrid,
      badge: "i will check",
      badgeType: "warn",
    },
    {
      id: "badges",
      label: "Badges",
      icon: Award,
      badge: "Coming soon",
      badgeType: "ok",
    },
  ];

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
        status: "active",
        expDate: "2025-08-15",
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
    categories: [
      {
        id: "cat-1",
        title: "German Language",
        subtitle: "Teaching & exam preparation",
        icon: "🇩🇪",
        status: "active",
        expDate: "2025-08-15",
      },
      {
        id: "cat-2",
        title: "Career Coaching",
        subtitle: "CV, LinkedIn & interview prep",
        icon: "💼",
        status: "pending",
      },
    ],
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategoriesForRegister();
        setAvailableCategories(response.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState(null);

  const handleOpenUploadModal = (doc) => {
    setModalContext(doc);
    setIsModalOpen(true);
  };

  const handleConfirmUpload = (file) => {
    if (!modalContext || !file) return;
    setRequests((prev) => ({
      ...prev,
      identity: prev.identity.map((item) =>
        item.id === modalContext.id
          ? { ...item, fileName: file.name, status: "pending", reason: null }
          : item,
      ),
    }));
  };

  const badges = [
    {
      id: 1,
      name: "Identity Verified",
      desc: "Your identity has been verified",
      status: "earned",
      icon: "🛡️",
    },
    {
      id: 2,
      name: "Professional",
      desc: "Completed professional verification",
      status: "earned",
      icon: "⭐",
    },
    {
      id: 3,
      name: "Top Rated",
      desc: "Maintain 4.8+ rating for 30 days",
      status: "upload",
      icon: "🏆",
    },
    {
      id: 4,
      name: "Quick Responder",
      desc: "Respond to 95% of inquiries within 2h",
      status: "locked",
      icon: "⚡",
    },
  ];

  return (
    <div className="animate-[fadeUp_0.3s_ease_both]">
      <div className="flex items-center gap-[7px] bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg p-2 mb-4 max-w-full">
        <Search size={13} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search documents, categories, badges…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent text-[13px] text-[#0a0f1e] w-full outline-none"
        />
      </div>

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
                className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${tab.badgeType === "warn" ? "bg-amber-200/50 text-amber-600" : "bg-emerald-100/50 text-emerald-600"}`}
              >
                {tab.badge}
              </span>
            </div>
          );
        })}
      </div>

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
            <DocumentSegment
              title="Identity Documents"
              subtitle="Government ID, Proof of Residence"
              icon={User}
              iconBgColor="bg-red-50"
              iconTextColor="text-red-600"
              documents={requests.identity}
              onUploadTrigger={handleOpenUploadModal}
              gridCols="grid-cols-1"
            />
            <DocumentSegment
              title="Business Registration"
              subtitle="Commercial license, Freelance permit, or School registration"
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

            <DocumentSegment
              title="My Service Categories"
              subtitle="Active and pending categories"
              icon={LayoutGrid}
              iconBgColor="bg-blue-50"
              iconTextColor="text-[#024CEE]"
              documents={requests.categories}
              onUploadTrigger={handleOpenUploadModal}
              gridCols="grid-cols-1 md:grid-cols-2"
            />

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
                    {availableCategories.length} main categories on Germany
                    Assists
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-1.5">
                  {availableCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2 border border-[#e0e7ff] rounded-lg"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1 text-[12.5px] font-medium text-[#0a0f1e]">
                        {cat.title || cat.label}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {cat.categoryType || ""}
                      </div>
                      <button className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#024CEE] border-none cursor-pointer hover:bg-blue-100 transition-colors">
                        Request
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <div className="flex gap-1.5 flex-wrap mb-3.5">
              {["All", "Verification", "Performance", "Engagement"].map(
                (cat, idx) => (
                  <button
                    key={idx}
                    className={`text-[11.5px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      idx === 0
                        ? "bg-[#024CEE] text-white border-[#024CEE]"
                        : "bg-white text-gray-500 border-[#e0e7ff] hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
            <div className="grid grid-cols-3 gap-[10px]">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`border rounded-lg p-3.5 transition-all relative ${badge.status === "earned" ? "border-emerald-200 bg-emerald-50/5" : "border-[#e0e7ff] bg-transparent"} ${badge.status === "locked" ? "opacity-60" : ""}`}
                >
                  {badge.status === "earned" && (
                    <div className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full bg-emerald-600 flex items-center justify-center">
                      <CheckCircle size={10} className="text-white" />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                      {badge.icon}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.status === "earned" ? "bg-emerald-100 text-emerald-600" : badge.status === "locked" ? "bg-gray-200 text-gray-500" : "bg-blue-50 text-blue-600"}`}
                    >
                      {badge.status === "earned"
                        ? "Earned"
                        : badge.status === "locked"
                          ? "Locked"
                          : "Upload"}
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-[#0a0f1e] mb-0.5">
                    {badge.name}
                  </div>
                  <div className="text-[11px] text-gray-500 leading-relaxed">
                    {badge.desc}
                  </div>
                  {badge.status !== "earned" && badge.status !== "locked" && (
                    <div className="text-[11px] font-semibold text-[#024CEE] cursor-pointer mt-1.5 inline-flex items-center gap-0.5 hover:underline">
                      Upload <ExternalLink size={11} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentConfig={modalContext}
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
