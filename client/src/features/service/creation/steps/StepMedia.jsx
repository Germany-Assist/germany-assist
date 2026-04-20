import React from "react";
import {
  Upload,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StepMedia = ({
  data,
  onUpdate,
  onAssetDeleted,
  onBack,
  onNext,
  isEditMode,
}) => {
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const newAsset = {
      file: file,
      url: URL.createObjectURL(file),
      key: type,
      isExisting: false,
    };

    if (type === "serviceProfileImage") {
      // If we are replacing an existing profile image, track the old one for deletion
      const oldProfile = data.assets.find(
        (a) => a.key === "serviceProfileImage",
      );
      if (oldProfile?.isExisting) onAssetDeleted(oldProfile.name);

      const filteredAssets = data.assets.filter(
        (a) => a.key !== "serviceProfileImage",
      );
      onUpdate({ assets: [...filteredAssets, newAsset] });
    } else {
      onUpdate({ assets: [...data.assets, newAsset] });
    }
  };

  const removeAsset = (asset) => {
    // Track for backend deletion if it was already in the database
    if (asset.isExisting) {
      onAssetDeleted(asset.name);
    }
    onUpdate({ assets: data.assets.filter((a) => a.url !== asset.url) });
  };

  const profileImg = data.assets.find((a) => a.key === "serviceProfileImage");
  const galleryImgs = data.assets.filter(
    (a) => a.key === "serviceProfileGalleryImage",
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Visuals matter
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          Upload a cover photo and your portfolio.
        </p>
      </div>

      {/* Main Profile Image */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          Main Photo <span className="text-red-500">*</span>
        </label>
        {profileImg ? (
          <div className="relative h-48 max-w-[340px] rounded-2xl overflow-hidden group border border-zinc-200 dark:border-white/10">
            <img
              src={profileImg.url}
              className="w-full h-full object-cover"
              alt="Profile"
            />
            <button
              type="button"
              onClick={() => removeAsset(profileImg)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl h-48 w-64 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-all">
            <Upload className="text-slate-400 mb-2" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Upload Cover
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "serviceProfileImage")}
            />
          </label>
        )}
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          Gallery (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {galleryImgs.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden group border border-zinc-200 dark:border-white/10"
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
                alt="Gallery"
              />
              <button
                type="button"
                onClick={() => removeAsset(img)}
                className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          {galleryImgs.length < 5 && (
            <label className="aspect-square border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all">
              <Upload className="text-slate-400" size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, "serviceProfileGalleryImage")
                }
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          disabled={!profileImg}
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white disabled:opacity-20 text-white dark:text-black font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95"
        >
          Next: Status And Review <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default StepMedia;
