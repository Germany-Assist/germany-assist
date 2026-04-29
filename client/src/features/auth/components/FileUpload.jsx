import React from "react";

const FileUpload = ({
  name,
  fieldName,
  icon,
  title,
  subtitle,
  badge,
  badgeText,
  file,
  onUpload,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
}) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="border-2 border-[#E5E7EB] rounded-xl p-4 flex items-start justify-between gap-3 mb-3 hover:border-[#93b4f7] transition-all">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-[#111827] flex items-center gap-1.5 flex-wrap">
            {title}
            {badge && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                {badgeText}
              </span>
            )}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5">{subtitle}</div>
        </div>
      </div>
      {file ? (
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-xs text-emerald-600 font-semibold max-w-[120px] truncate">
            {file.name}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex-shrink-0 px-3.5 py-1.5 rounded-lg border-2 border-[#024CEE] text-[#024CEE] text-xs font-semibold cursor-pointer hover:bg-[#EBF1FD] transition-all bg-white">
          Upload
          <input
            type="file"
            name={fieldName || name}
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
