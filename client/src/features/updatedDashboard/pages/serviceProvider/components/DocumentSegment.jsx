import React from "react";
import { CheckCircle, Clock, FileText, Upload, XCircle } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "verified":
    case "active":
      return { bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-200", icon: CheckCircle };
    case "rejected":
      return { bg: "bg-red-50", color: "text-red-600", border: "border-red-200", icon: XCircle };
    case "pending":
      return { bg: "bg-blue-50", color: "text-blue-600", border: "border-blue-100", icon: Clock };
    case "not-uploaded":
    case "inactive":
      return { bg: "bg-gray-50", color: "text-gray-500", border: "border-gray-200", icon: Clock };
    default:
      return { bg: "bg-gray-50", color: "text-gray-500", border: "border-gray-200" };
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
  gridCols = "grid-cols-1",
  onUploadTrigger,
}) {
  return (
    <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden text-left">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#e0e7ff]">
        <div className={`w-[30px] h-[30px] rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <Icon size={15} className={iconTextColor} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#0a0f1e]">{title}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{subtitle}</div>
        </div>
      </div>

      <div className="p-4">
        <div className={`grid ${gridCols} gap-[10px]`}>
          {documents.map((doc) => {
            const status = getStatusColor(doc.status);
            const StatusIcon = status.icon;
            const isCategory = !!doc.icon;

            return (
              <div
                key={doc.id}
                className={`border rounded-lg p-3 flex items-start gap-2.5 transition-all ${
                  doc.status === "verified" || doc.status === "active"
                    ? "border-emerald-200 bg-emerald-50/5"
                    : doc.status === "rejected"
                      ? "border-red-200 bg-red-50/5"
                      : "border-[#e0e7ff] bg-transparent"
                }`}
              >
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-row flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-[34px] h-[34px] rounded-lg ${status.bg} flex items-center justify-center shrink-0`}>
                        {isCategory ? (
                          <span className="text-lg">{doc.icon}</span>
                        ) : (
                          <FileText size={15} className={status.color} />
                        )}
                      </div>
                      <div className="text-xs font-semibold text-[#0a0f1e]">
                        {doc.title}{" "}
                        {!doc.required && <span className="text-gray-500 text-xs">(Optional)</span>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${status.color}`}>
                      {StatusIcon && <StatusIcon size={11} />}
                      {getStatusLabel(doc.status)}
                      {doc.expDate && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 ml-1">
                          Exp: {doc.expDate}
                        </span>
                      )}
                      {doc.status === "rejected" && doc.reason && ` — ${doc.reason}`}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-0.5">{doc.subtitle}</div>

                  {isCategory && doc.requirements && doc.requirements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doc.requirements.map((req, idx) => (
                        <span key={idx} className={`text-[10.5px] px-1.5 py-0.5 rounded ${status.bg} ${status.color}`}>
                          {req.icon} {req.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5">
                    {doc.status === "rejected" && !doc.fileName && (
                      <button
                        type="button"
                        onClick={() => onUploadTrigger(doc)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-md border-none bg-[#024CEE] text-white cursor-pointer flex items-center gap-1 hover:bg-blue-700 transition-colors"
                      >
                        <Upload size={11} /> Upload
                      </button>
                    )}
                    {doc.fileName && (
                      <>
                        <div className="flex items-center gap-1 bg-[#f7f9ff] border border-[#e0e7ff] rounded-md px-2 py-1 text-[11px] text-[#0a0f1e] max-w-[160px] overflow-hidden">
                          <FileText size={10} className="text-gray-400 shrink-0" />
                          <span className="truncate">{doc.fileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onUploadTrigger(doc)}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#e0e7ff] bg-white text-[#024CEE] cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          {isCategory ? "Manage" : "Replace"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}