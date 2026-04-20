import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Loader2,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  ShieldCheck,
  Fingerprint,
  Award,
  AlertCircle,
  ChevronRight,
  Mail,
  XCircle,
} from "lucide-react";

import {
  serviceProviderGetVerificationStatus,
  serviceProviderReSubmitVerification,
  serviceProviderSubmitVerification,
} from "../../../../api/serviceProviderApis";

import { useMeta } from "../../../../contexts/MetadataContext";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";
import StatusModal from "../../../../components/ui/StatusModal";
import { getErrorMessage } from "../../../../api/errorMessages";

const VerificationHub = () => {
  const { categories } = useMeta();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeTarget, setActiveTarget] = useState("identity");
  const [verificationList, setVerificationList] = useState([]);
  const [statusModalCon, setStatusModalCon] = useState(null);

  const [files, setFiles] = useState({
    verificationImage: null,
    verificationDocument: null,
  });

  const init = async () => {
    setLoading(true);
    try {
      const res = await serviceProviderGetVerificationStatus();
      setVerificationList(res?.data || []);
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const getCurrentItem = () => {
    if (activeTarget === "identity") {
      return verificationList.find((v) => v.type === "identity");
    }
    return verificationList.find((v) => v.relatedId === activeTarget);
  };

  const handleAction = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      const isIdentity = activeTarget === "identity";

      formData.append("type", isIdentity ? "identity" : "category");
      if (!isIdentity) formData.append("relatedId", activeTarget);

      if (files.verificationImage)
        formData.append("verificationImage", files.verificationImage);
      if (files.verificationDocument)
        formData.append("verificationDocument", files.verificationDocument);

      const currentItem = getCurrentItem();

      if (currentItem && currentItem.status === "adminRequest") {
        await serviceProviderReSubmitVerification(formData);
      } else {
        await serviceProviderSubmitVerification(formData);
      }

      setVerificationList((prev) => {
        const newList = [...prev];
        const index = newList.findIndex((v) =>
          isIdentity ? v.type === "identity" : v.relatedId === activeTarget,
        );

        if (index !== -1) {
          newList[index] = { ...newList[index], status: "pending" };
        } else {
          newList.push({
            type: isIdentity ? "identity" : "category",
            relatedId: isIdentity ? null : activeTarget,
            status: "pending",
            assets: [],
          });
        }
        return newList;
      });

      setStatusModalCon({
        isOpen: true,
        type: "success",
        message: "Your application is now under review.",
        onClose: () => {
          setStatusModalCon(null);
          setFiles({ verificationImage: null, verificationDocument: null });
          init();
        },
      });
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        type: "error",
        message: getErrorMessage(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-white/20" size={40} />
      </div>
    );

  const currentItem = getCurrentItem();
  const currentStatus = currentItem?.status || null;
  const activeCategoryLabel =
    categories.find((c) => c.id === activeTarget)?.label || "Identity";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StatusModal
        {...statusModalCon}
        onClose={() => setStatusModalCon(null)}
      />

      <DashboardHeader
        title="Verification Hub"
        subtitle="Manage your professional credentials and identity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-4 space-y-6">
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-4 mb-4">
              Core Verification
            </h4>
            <VerificationTab
              icon={Fingerprint}
              label="Identity"
              status={
                verificationList.find((v) => v.type === "identity")?.status
              }
              isActive={activeTarget === "identity"}
              onClick={() => setActiveTarget("identity")}
            />
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-4 mb-4">
              Category Badges
            </h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <VerificationTab
                  key={cat.id}
                  icon={Award}
                  label={cat.label}
                  status={
                    verificationList.find((v) => v.relatedId === cat.id)?.status
                  }
                  isActive={activeTarget === cat.id}
                  onClick={() => setActiveTarget(cat.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* MAIN DISPLAY AREA */}
        <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md min-h-[600px] relative overflow-hidden">
          {currentStatus === "approved" ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={56} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                Verified
              </h2>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Your {activeCategoryLabel} is fully verified.
              </p>
            </div>
          ) : currentStatus === "pending" ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20 animate-in fade-in">
              <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20 animate-pulse">
                <Loader2 size={48} className="animate-spin" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                Reviewing
              </h2>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Our team is reviewing your documents.
              </p>
            </div>
          ) : currentStatus === "rejected" ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-20 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                <XCircle size={56} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-red-500">
                  Rejected
                </h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  This verification request has been permanently declined by our
                  compliance team.
                </p>
              </div>

              {currentItem.adminNote && (
                <div className="w-full max-w-md p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-left">
                  <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">
                    Rejection Reason
                  </span>
                  <p className="text-zinc-300 text-sm italic mt-2">
                    "{currentItem.adminNote}"
                  </p>
                </div>
              )}

              <a
                href={`mailto:support@yourdomain.com?subject=Verification Rejection - ${activeCategoryLabel}`}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
              >
                <Mail size={18} className="text-zinc-400" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Appeal to Support
                </span>
              </a>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-top-2 duration-500">
              <header className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Verification Step
                  </span>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">
                    {activeCategoryLabel}
                  </h2>
                </div>
              </header>

              {currentStatus === "adminRequest" && (
                <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex gap-5 items-center border-l-4 border-l-blue-500">
                  <MessageCircle className="text-blue-400" size={24} />
                  <p className="text-zinc-300 text-sm italic font-medium leading-relaxed">
                    "{currentItem.adminNote}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UploadBox
                  label="Reference Image"
                  file={files.verificationImage}
                  type="image"
                  onChange={(f) =>
                    setFiles((p) => ({ ...p, verificationImage: f }))
                  }
                  onClear={() =>
                    setFiles((p) => ({ ...p, verificationImage: null }))
                  }
                />
                <UploadBox
                  label="Official Document"
                  file={files.verificationDocument}
                  type="pdf"
                  onChange={(f) =>
                    setFiles((p) => ({ ...p, verificationDocument: f }))
                  }
                  onClear={() =>
                    setFiles((p) => ({ ...p, verificationDocument: null }))
                  }
                />
              </div>

              <button
                disabled={
                  submitting ||
                  (!files.verificationImage && !files.verificationDocument)
                }
                onClick={handleAction}
                className="w-full bg-white text-black py-6 rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <UploadCloud size={20} />
                )}
                {currentStatus === "adminRequest"
                  ? "Resubmit Fixes"
                  : "Submit Verification"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- TAB COMPONENT --- */
const VerificationTab = ({ icon: Icon, label, status, isActive, onClick }) => {
  const statusConfig = {
    approved: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Verified",
    },
    pending: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      label: "In Review",
    },
    adminRequest: {
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      label: "Action",
    },
    rejected: { color: "text-red-400", bg: "bg-red-400/10", label: "Rejected" },
  };
  const current = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-500 ${
        isActive
          ? "bg-white border-white shadow-2xl scale-[1.03] z-10"
          : "bg-zinc-900 border-white/5"
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={20} className={isActive ? "text-black" : "text-zinc-500"} />
        <span
          className={`text-xs font-black uppercase tracking-tight ${isActive ? "text-black" : "text-zinc-400"}`}
        >
          {label}
        </span>
      </div>
      {status ? (
        <div
          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${current.bg} ${current.color}`}
        >
          {current.label}
        </div>
      ) : (
        <ChevronRight
          size={14}
          className={isActive ? "text-black/20" : "text-zinc-800"}
        />
      )}
    </button>
  );
};

/* --- UPLOAD COMPONENT --- */
const UploadBox = ({ label, file, type, onChange, onClear }) => {
  const isImage = type === "image";
  return (
    <div className="space-y-4">
      <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-200 ml-1">
        {label}
      </h5>
      <div className="relative aspect-video rounded-[2.5rem] bg-zinc-800/50 border-2 border-dashed border-white/5 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500/30">
        {file ? (
          <div className="relative w-full h-full animate-in zoom-in-95">
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <FileText className="text-blue-500" size={48} />
              </div>
            )}
            <button
              onClick={onClear}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <Plus size={24} className="text-zinc-600 mb-2" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Select {type}
            </span>
            <input
              type="file"
              className="hidden"
              accept={isImage ? "image/*" : ".pdf"}
              onChange={(e) => onChange(e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default VerificationHub;
