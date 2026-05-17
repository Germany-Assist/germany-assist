import React from "react";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const FileUpload = ({
  name,
  fieldName,
  icon,
  title,
  subtitle,
  badge,
  badgeText,
  files,
  onUpload,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
}) => {
  const fileList = Array.isArray(files) ? files : files ? [files] : [];
  const hasFiles = fileList.length > 0;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`File size must be less than 2MB`);
      return;
    }

    if (multiple) {
      const currentCount = fileList.length;
      if (currentCount + newFiles.length > MAX_FILES) {
        alert(`Maximum ${MAX_FILES} files allowed`);
        return;
      }
      const combinedFiles = [...fileList, ...newFiles].slice(0, MAX_FILES);
      onUpload(combinedFiles);
    } else {
      if (newFiles[0]) {
        onUpload(newFiles[0]);
      }
    }
  };

  const handleRemoveFile = (index) => {
    if (multiple) {
      const newFiles = fileList.filter((_, i) => i !== index);
      onUpload(newFiles);
    } else if (onRemove) {
      onRemove();
    }
  };

  const formatFileSize = (bytes) => {
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  return (
    <div className="border-2 border-[#E5E7EB] rounded-xl p-4 mb-3 hover:border-[#93b4f7] transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
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
        
        {multiple ? (
          <label className="flex-shrink-0 px-3.5 py-1.5 rounded-lg border-2 border-[#024CEE] text-[#024CEE] text-xs font-semibold cursor-pointer hover:bg-[#EBF1FD] transition-all bg-white">
            Upload
            <input
              type="file"
              name={fieldName || name}
              accept={accept}
              className="hidden"
              multiple={multiple}
              onChange={handleFileChange}
              disabled={fileList.length >= MAX_FILES}
            />
          </label>
        ) : (
          !hasFiles && (
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
          )
        )}
      </div>

      {hasFiles && (
        <div className="space-y-2 mt-3 pt-3 border-t border-[#E5E7EB]">
          {fileList.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border border-[#E5E7EB] rounded-lg bg-white">
              <div className="w-8 h-8 rounded-lg bg-[#EBF1FD] border border-blue-200 flex items-center justify-center text-xs font-bold text-[#024CEE]">
                {getFileExtension(file.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#111827] truncate">
                  {file.name}
                </div>
                <div className="text-xs text-[#9CA3AF]">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <div className="text-green-500 text-sm">✓</div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-[#9CA3AF] hover:text-red-500 text-sm px-1"
              >
                ✕
              </button>
            </div>
          ))}
          
          {multiple && fileList.length < MAX_FILES && (
            <label className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-3 text-center cursor-pointer hover:border-[#024CEE] hover:bg-[#EBF1FD] transition-all block">
              <div className="text-sm font-medium text-[#024CEE]">+ Add more files</div>
            </label>
          )}
          
          {!multiple && (
            <button
              type="button"
              onClick={() => handleRemoveFile(0)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove file
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;