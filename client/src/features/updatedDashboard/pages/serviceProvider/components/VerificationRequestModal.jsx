import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  AlertCircle,
  LayoutGrid,
  CheckCircle,
  FileText,
  User,
} from "lucide-react";
import { useMeta } from "../../../../../contexts/MetadataContext";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function VerificationRequestModal({
  isOpen,
  onClose,
  /** Type of verification: "category" or "identity" */
  type = "category",
  /** Modal mode: "request" shows selector + upload, "info" is view-only */
  mode = "info",
  /** Pre-selected ID (Category ID or Identity Type ID) */
  preselectedId = null,
  /** Request status (from user's requests) - for "info" mode display */
  requestStatus = null,
  onSubmit,
}) {
  const { availableCategoryTypes, availableIdentityTypes } = useMeta();

  // Selector value
  const [selectedId, setSelectedId] = useState(preselectedId);
  // Uploaded files storage
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // Error message
  const [error, setError] = useState("");
  // File input reference
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes or preselected changes
  useEffect(() => {
    if (isOpen) {
      setSelectedId(preselectedId);
      setUploadedFiles([]);
      setError("");
    }
  }, [isOpen, preselectedId]);

  if (!isOpen) return null;

  // Get current meta list based on type
  const metaList =
    type === "identity"
      ? availableIdentityTypes || []
      : availableCategoryTypes || [];

  // Get full meta data by ID
  const getMetaById = (id) => metaList.find((m) => m.id === id);
  const selectedMeta = selectedId ? getMetaById(selectedId) : null;

  // Get status display styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
      case "approved":
      case "verified":
        return {
          bg: "bg-emerald-100",
          color: "text-emerald-600",
          label: "Verified",
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          color: "text-amber-600",
          label: "Pending",
        };
      case "rejected":
        return { bg: "bg-red-100", color: "text-red-600", label: "Rejected" };
      default:
        return { bg: "bg-gray-100", color: "text-gray-500", label: "Unknown" };
    }
  };

  // Handle file selection with validation
  const handleFileSelection = (files) => {
    setError("");
    const fileArray = Array.from(files);

    const oversized = fileArray.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError("Some files exceed 2 MB limit and were not added.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const invalid = fileArray.filter((f) => !allowedTypes.includes(f.type));
    if (invalid.length > 0) {
      setError("Only PDF, JPG, PNG files are allowed.");
      return;
    }

    const remaining = MAX_FILES - uploadedFiles.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    setUploadedFiles((prev) => [...prev, ...fileArray.slice(0, remaining)]);
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  // Remove file from list
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Format file size to KB
  const formatFileSize = (bytes) => Math.round(bytes / 1024) + " KB";

  // Get file extension
  const getFileExtension = (filename) =>
    filename.split(".").pop().toUpperCase();

  // Handle modal submit
  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one supporting document.");
      return;
    }
    onSubmit?.({
      type,
      relatedId: selectedId,
      files: uploadedFiles,
    });
    onClose();
  };

  // Current status badge
  const statusBadge = requestStatus ? getStatusBadge(requestStatus) : null;

  const titleText =
    type === "identity"
      ? mode === "request"
        ? "Verify Identity"
        : "Identity Document"
      : mode === "request"
        ? "Add Service Category"
        : "Category Details";

  const IconComponent = type === "identity" ? User : LayoutGrid;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <IconComponent size={15} className="text-[#024CEE]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0a0f1e]">
                {titleText}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {mode === "request" && !selectedMeta
                  ? `Select ${type} to see requirements`
                  : selectedMeta?.title || selectedMeta?.label}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-left max-h-[70vh] overflow-y-auto">
          {/* Selector (only in request mode if no ID pre-selected or if allowed to change) */}
          {mode === "request" && !preselectedId && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0a0f1e] mb-1.5">
                Select {type === "identity" ? "document type" : "category"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedId || ""}
                onChange={(e) => {
                  setSelectedId(e.target.value || null);
                  setUploadedFiles([]);
                }}
                className="w-full px-3 py-2 border border-[#e0e7ff] rounded-lg text-[13px] text-[#0a0f1e] bg-white outline-none focus:border-[#024CEE] cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">
                  — Choose {type === "identity" ? "type" : "category"} —
                </option>
                {metaList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon && (typeof m.icon === "string" ? m.icon : "")}{" "}
                    {m.title || m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Info Block */}
          {selectedMeta && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden mb-4">
              {/* Header with Icon */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border-b border-[#e0e7ff]">
                <span className="text-xl">
                  {selectedMeta.icon && typeof selectedMeta.icon === "string"
                    ? selectedMeta.icon
                    : type === "identity"
                      ? "🪪"
                      : "📁"}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#0a0f1e]">
                    {selectedMeta.title || selectedMeta.label}
                  </div>
                  {selectedMeta.categoryType && (
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {selectedMeta.categoryType}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Requirements */}
                {selectedMeta.requirements &&
                  selectedMeta.requirements.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Accepted formats & details
                      </div>
                      <ul className="space-y-3">
                        {Array.isArray(selectedMeta.requirements) &&
                        typeof selectedMeta.requirements[0] === "string"
                          ? selectedMeta.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 flex-shrink-0" />
                                <div className="text-[12.5px] text-[#0a0f1e]">
                                  {req}
                                </div>
                              </li>
                            ))
                          : selectedMeta.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-[#0a0f1e]">
                                    {req.icon} {req.title}
                                    {req.badge && (
                                      <span className="text-[10px] font-semibold ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-[#024CEE] border border-blue-200">
                                        🏅 {req.badge}
                                      </span>
                                    )}
                                  </div>
                                  {req.description && (
                                    <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                                      {req.description}
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                      </ul>
                    </div>
                  )}

                {/* Required Documents (mostly for categories) */}
                {selectedMeta.documents &&
                  selectedMeta.documents.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Required documents
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {selectedMeta.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 px-3 py-2 border border-[#e0e7ff] rounded-lg"
                          >
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${doc.required ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"}`}
                            >
                              {doc.required ? "Required" : "Optional"}
                            </span>
                            <div>
                              <div className="text-[12.5px] font-semibold text-[#0a0f1e]">
                                {doc.name}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {doc.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* File Upload Area (only in request mode) */}
                {mode === "request" && (
                  <div>
                    <div className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Upload supporting documents
                    </div>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        uploadedFiles.length > 0
                          ? "border-emerald-300 bg-emerald-50/10"
                          : "border-gray-200 hover:border-blue-300 bg-gray-50/50"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleFileSelection(e.target.files)}
                      />

                      {uploadedFiles.length === 0 ? (
                        <div className="flex flex-col items-center">
                          <div className="text-2xl mb-1">📎</div>
                          <div className="text-sm font-medium text-[#024CEE]">
                            Click to upload files
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            PDF, JPG, PNG · max 2MB each
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 border border-[#e0e7ff] rounded-lg bg-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-[#024CEE]">
                                {getFileExtension(file.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[#0a0f1e] truncate">
                                  {file.name}
                                </div>
                                <div className="text-[10.5px] text-gray-400">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                              <div className="text-emerald-500 text-sm">
                                <CheckCircle size={14} />
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="text-gray-400 hover:text-red-500 text-sm px-1 border-none bg-transparent cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {uploadedFiles.length < MAX_FILES && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="text-[11px] font-medium text-[#024CEE] py-1 cursor-pointer hover:underline"
                            >
                              + Add more files
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {mode === "request" && !selectedMeta && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Select {type === "identity" ? "a type" : "a category"} above to
              see requirements.
            </div>
          )}

          {/* Fallback for info mode with no selection */}
          {mode === "info" && !selectedMeta && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No details available for this request.
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-5 mb-4 flex items-start gap-1.5 p-2.5 rounded-md bg-red-50 text-red-600 text-[11px]">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <div className="text-[11px] text-gray-500">
            {mode === "request" && uploadedFiles.length === 0
              ? "Upload supporting documents below."
              : mode === "request" && uploadedFiles.length > 0
                ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} ready to submit`
                : ""}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {mode === "request" ? "Cancel" : "Close"}
            </button>
            {mode === "request" && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedId || uploadedFiles.length === 0}
                className="px-4 py-1.5 rounded-lg bg-[#024CEE] text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
