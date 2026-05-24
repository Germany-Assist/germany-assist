import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  ChevronDown,
  Plus,
  ExternalLink,
} from "lucide-react";

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
    default:
      return {
        bg: "bg-gray-50",
        color: "text-gray-500",
        border: "border-gray-200",
        icon: Clock,
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
    default:
      return "Not uploaded";
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
  isCategorySegment = false,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white border border-[#e0e7ff] rounded-xl mb-3 overflow-hidden text-left">
      {/* Clickable Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 border-b border-[#e0e7ff] hover:bg-gray-50/50 transition-colors text-left cursor-pointer focus:outline-none"
      >
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
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Accordion Expansion Body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "max-h-[3000px] opacity-100 p-4"
            : "max-h-0 opacity-0 p-0 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {documents.map((doc) => {
            const statusStyle = getStatusColor(doc.status);
            const StatusIcon = statusStyle.icon;
            const isCategory = !!doc.icon;
            const hasExistingAssets = doc.assets && doc.assets.length > 0;

            return (
              <div
                key={doc.id}
                className={`border rounded-xl p-4 flex flex-col justify-between md:flex-row gap-4 transition-all ${statusStyle.border} ${statusStyle.bg}/30`}
              >
                {/* Left side Metadata block */}
                <div className="flex-1 flex flex-col items-start gap-2">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-[36px] h-[36px] rounded-lg ${statusStyle.bg} flex items-center justify-center shrink-0`}
                    >
                      {isCategory ? (
                        <span className="text-lg">{doc.icon}</span>
                      ) : (
                        <FileText size={16} className={statusStyle.color} />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#0a0f1e] truncate max-w-[180px] sm:max-w-[240px]">
                      {doc.title}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed break-words text-left">
                    {doc.subtitle}
                  </p>

                  {/* ⚡ MULTI-ASSET RENDERING ARRAY */}
                  {hasExistingAssets && (
                    <div className="flex flex-wrap gap-1.5 mt-1 w-full">
                      {doc.assets.map((asset, index) => {
                        // Extract file name clean values from encoded S3/Storage URLs
                        const cleanFileName = asset.url
                          ? asset.url.split("/").pop().split("?")[0].slice(-16)
                          : `Asset-${index + 1}`;

                        return (
                          <a
                            key={index}
                            href={asset.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={asset.label || cleanFileName}
                            className="inline-flex items-center gap-1 bg-white border border-[#e0e7ff] hover:border-blue-300 hover:text-[#024CEE] transition-all rounded-lg px-2 py-1 text-[10.5px] text-[#0a0f1e] max-w-[130px] sm:max-w-[150px]"
                          >
                            <FileText
                              size={11}
                              className="text-gray-400 shrink-0"
                            />
                            <span className="truncate flex-1 text-left">
                              {asset.label || cleanFileName}
                            </span>
                            <ExternalLink
                              size={10}
                              className="opacity-40 shrink-0"
                            />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right side interactive actions block */}
                <div className="flex flex-col justify-between items-start md:items-end gap-2 shrink-0">
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border} px-2 py-0.5 rounded-full`}
                  >
                    <StatusIcon size={12} className="shrink-0" />
                    <span className="max-w-[140px] truncate">
                      {getStatusLabel(doc.status)}
                      {doc.status === "rejected" &&
                        doc.reason &&
                        ` — ${doc.reason}`}
                    </span>
                  </div>

                  {doc.expDate && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                      Exp: {doc.expDate}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onUploadTrigger(doc)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-[#e0e7ff] bg-white text-[#024CEE] cursor-pointer hover:bg-gray-50 transition-colors shadow-xs w-full md:w-auto text-center"
                  >
                    {hasExistingAssets
                      ? isCategorySegment
                        ? "View"
                        : "Update"
                      : "Upload"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Cleaned "Add Category" Card Block */}
          {isCategorySegment && (
            <button
              type="button"
              onClick={() =>
                onUploadTrigger({ id: null, title: "New Request" })
              } // Uses unified router context smoothly
              className="border border-dashed border-[#e0e7ff] bg-gray-50/30 hover:bg-gray-50/80 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center w-full min-h-[140px] group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Plus size={14} className="text-[#024CEE]" strokeWidth={2.5} />
              </div>
              <div className="text-xs font-semibold text-[#024CEE]">
                Add Category
              </div>
              <div className="text-[11px] text-gray-500 max-w-[200px]">
                Request access to a new service category
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
