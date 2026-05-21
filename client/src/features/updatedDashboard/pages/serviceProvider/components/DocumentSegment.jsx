import React from "react";
import { CheckCircle, Clock, FileText, Upload, XCircle } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "verified":
    case "active":
      return {
        bg: "bg-emerald-50",
        color: "text-emerald-600",
        border: "border-emerald-200",
        icon: CheckCircle,
      };
    case "rejected":
      return {
        bg: "bg-red-50",
        color: "text-red-600",
        border: "border-red-200",
        icon: XCircle,
      };
    case "pending":
      return {
        bg: "bg-blue-50",
        color: "text-blue-600",
        border: "border-blue-100",
        icon: Clock,
      };
    case "not-uploaded":
    case "inactive":
      return {
        bg: "bg-gray-50",
        color: "text-gray-500",
        border: "border-gray-200",
        icon: Clock,
      };
    default:
      return {
        bg: "bg-gray-50",
        color: "text-gray-500",
        border: "border-gray-200",
      };
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "verified":
    case "active":
      return "Verified";
    case "rejected":
      return "Rejected";
    case "pending":
      return "Under review";
    case "not-uploaded":
    case "inactive":
      return "Not uploaded";
    default:
      return status;
  }
};

export default function DocumentSegment({
  title,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-blue-50",
  iconTextColor = "text-[#024CEE]",
  documents = [],
  onUploadTrigger,
}) {
  return (
    <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden text-left">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#e0e7ff]">
        <div
          className={`w-[30px] h-[30px] rounded-lg ${iconBgColor} flex items-center justify-center`}
        >
          <Icon size={15} className={iconTextColor} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#0a0f1e]">
            {title}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">{subtitle}</div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const status = getStatusColor(doc.status);
            const StatusIcon = status.icon;
            const isCategory = !!doc.icon;

            return (
              <div
                key={doc.id}
                className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  doc.status === "verified" || doc.status === "active"
                    ? "border-emerald-200 bg-emerald-50/5"
                    : doc.status === "rejected"
                      ? "border-red-200 bg-red-50/5"
                      : "border-[#e0e7ff] bg-transparent"
                }`}
              >
                {/* Left Side: Meta info and Icon block */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-[36px] h-[36px] rounded-lg ${status.bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    {isCategory ? (
                      <span className="text-lg">{doc.icon}</span>
                    ) : (
                      <FileText size={16} className={status.color} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title Header */}
                    <div className="text-xs font-semibold text-[#0a0f1e] flex flex-wrap items-center gap-1.5">
                      <span className="truncate">{doc.title}</span>
                      {!doc.required && (
                        <span className="text-gray-400 text-[11px] font-normal">
                          (Optional)
                        </span>
                      )}
                    </div>

                    {/* Subtitle Description */}
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed break-words">
                      {doc.subtitle}
                    </p>

                    {/* Badges: Live Status Message & Expiry Dates */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${status.color}`}
                      >
                        {StatusIcon && (
                          <StatusIcon size={12} className="shrink-0" />
                        )}
                        <span>
                          {getStatusLabel(doc.status)}
                          {doc.status === "rejected" &&
                            doc.reason &&
                            ` — ${doc.reason}`}
                        </span>
                      </div>

                      {doc.expDate && (
                        <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                          Exp: {doc.expDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Interactive Actions and File Links */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {doc.status === "rejected" && !doc.fileName && (
                    <button
                      type="button"
                      onClick={() => onUploadTrigger(doc)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border-none bg-[#024CEE] text-white cursor-pointer inline-flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Upload size={12} /> Upload
                    </button>
                  )}

                  {doc.fileName && (
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 bg-[#f7f9ff] border border-[#e0e7ff] rounded-lg px-2 py-1.5 text-[11px] text-[#0a0f1e] max-w-[140px] sm:max-w-[160px]">
                        <FileText
                          size={12}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="truncate">{doc.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUploadTrigger(doc)}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-[#e0e7ff] bg-white text-[#024CEE] cursor-pointer hover:bg-gray-50 transition-colors shadow-xs"
                      >
                        Replace File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
