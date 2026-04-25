import React from "react";

const ProfileImageUpload = ({ file, onUpload, onRemove }) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1">
        Profile Image
        <span className="text-[#6B7280] font-normal text-xs">
          {" "}
          — Optional — Square 1:1, high resolution
        </span>
      </label>
      <div className="relative border-2 border-dashed border-[#E5E7EB] rounded-xl py-5 text-center cursor-pointer bg-[#F9FAFB] transition-all hover:border-[#024CEE]">
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => onUpload(e.target.files[0])}
        />
        {file ? (
          <div className="flex flex-col items-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover mb-2"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-medium">
                ✓ {file.name}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl mb-1">🖼️</div>
            <p className="text-sm text-[#024CEE] font-medium">
              <span className="font-semibold">Click to upload</span> your photo
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              JPG or PNG — Square (1:1) — min 400×400px
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;