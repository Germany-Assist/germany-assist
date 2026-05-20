import React, { useState, useRef } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";

export default function UploadModal({
  isOpen,
  onClose,
  documentConfig,
  onConfirmUpload,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen || !documentConfig) return null;

  const handleFileSelection = (file) => {
    setError("");
    if (!file) return;

    // Validation: Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds the 2 MB limit.");
      return;
    }

    // Validation: Allowed Formats
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid format. Please upload a PDF, JPG, or PNG file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload first.");
      return;
    }
    onConfirmUpload(selectedFile);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-[#0a0f1e]">
              Upload {documentConfig.title}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Formats: PDF, JPG, PNG up to 2MB
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-5 text-left">
          {/* Drag & Drop Target Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              selectedFile
                ? "border-emerald-300 bg-emerald-50/10"
                : "border-gray-200 hover:border-blue-300 bg-gray-50/50"
            }`}
          >
            <input
              type="ref"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileSelection(e.target.files[0])}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
                  <FileText size={20} />
                </div>
                <p className="text-xs font-semibold text-[#0a0f1e] max-w-[240px] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to
                  submit
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#024CEE] mb-2">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-medium text-[#0a0f1e]">
                  <span className="text-[#024CEE] font-semibold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Your files will be securely handled
                </p>
              </div>
            )}
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div className="mt-3 flex items-start gap-1.5 p-2.5 rounded-md bg-red-50 text-red-600 text-[11px]">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions Row */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-4 py-1.5 rounded-lg bg-[#024CEE] text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
