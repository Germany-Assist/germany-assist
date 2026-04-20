import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useState, useEffect } from "react";
import PLACEHOLDER from "../../assets/placeholders/placeholder.png";

const ImageGallery = ({ assets = [] }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const mainImages = Array.isArray(assets)
    ? assets.filter((a) => a?.url && !a.thumb)
    : [];

  const hasImages = mainImages.length > 0;

  const openLightbox = (idx) => {
    if (!hasImages) return;
    setActivePhotoIdx(idx);
    setIsLightboxOpen(true);
  };

  // Body scroll lock (safe)
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLightboxOpen]);

  const getSafeUrl = (url) => url || PLACEHOLDER;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-4">
        {/* Main Image or Placeholder */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden min-h-[300px] bg-gray-100 rounded-xl"
        >
          <img
            src={getSafeUrl(mainImages[0]?.url)}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            alt="Service"
          />

          {!hasImages && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
              No images available
            </div>
          )}
        </div>

        {/* Secondary Tiles (only if images exist) */}
        {hasImages &&
          mainImages.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="hidden md:block relative group cursor-pointer overflow-hidden border-l border-white"
            >
              <img
                src={getSafeUrl(img.url)}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                alt="Gallery"
              />
              {idx === 3 && mainImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white font-bold">
                  <Maximize2 size={24} className="mb-2" />
                  <span>+{mainImages.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && hasImages && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full z-[110]"
          >
            <X size={32} />
          </button>

          <button
            onClick={() =>
              setActivePhotoIdx((prev) =>
                prev === 0 ? mainImages.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={getSafeUrl(mainImages[activePhotoIdx]?.url)}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              alt="Full"
            />
          </div>

          <button
            onClick={() =>
              setActivePhotoIdx((prev) =>
                prev === mainImages.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
