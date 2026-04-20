import React, { useEffect, useState } from "react";
import LOCAL_FALLBACK from "../../assets/placeholders/placeholder.png";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({
  data = {},
  isDummy,
  dummyProfileImage,
  favorite,
  onFavoriteClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const navigation = useNavigate();
  useEffect(() => {
    setIsFavorite(favorite);
  }, [favorite]);
  const {
    id = "---",
    serviceProvider = "Provider",
    image,
    level = "Ready",
    title = "Untitled Service",
    description = "No description available.",
    rating = 0,
    variants = null,
    timelines = null,
  } = data;
  const minPrice = variants
    ? variants.minPrice
    : timelines
      ? timelines.minPrice
      : 0;
  const maxPrice = variants
    ? variants.maxPrice
    : timelines
      ? timelines.maxPrice
      : 0;

  const handleFav = async (e) => {
    if (isDummy) return;
    e.stopPropagation();
    if (onFavoriteClick) {
      try {
        const resp = await onFavoriteClick();
        if (resp) setIsFavorite(!isFavorite);
      } catch (error) {}
    }
  };
  return (
    <div
      onClick={() => {
        if (isDummy) return;
        navigation(`/service/${id}`);
      }}
      className="group relative w-full max-w-[340px] mx-auto h-full cursor-pointer isolate"
    >
      {/* GLOW LAYER: Subtle cyan glow that feels "expensive" */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/40 to-blue-500/20 rounded-[2.2rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]" />

      {/* MAIN CONTAINER: Swapped to light-800 / dark-800 */}
      <div
        className="relative bg-light-800 dark:bg-dark-800 border border-light-700 dark:border-white/10 rounded-[2.2rem] flex flex-col h-full shadow-lg transition-all duration-500 ease-elegant group-hover:-translate-y-2 overflow-hidden"
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {/* IMAGE SECTION */}
        <div className="h-48 w-full relative overflow-hidden">
          <img
            src={
              dummyProfileImage ? dummyProfileImage : image || LOCAL_FALLBACK
            }
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LOCAL_FALLBACK;
            }}
          />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Badge: Adapts transparency for mode */}
            <span className="bg-black/40 dark:bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-lg border border-white/10 uppercase tracking-widest">
              {serviceProvider}
            </span>

            <button
              onClick={handleFav}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                isFavorite
                  ? "bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-black/20 dark:bg-black/40 border-white/20 text-white hover:bg-white hover:text-black"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors capitalize leading-tight">
                {title}
              </h3>
              <span className="text-accent text-[10px] font-bold uppercase tracking-tighter">
                {level}
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light line-clamp-4 break-words">
              {description}
            </p>

            <div className="flex gap-4 mt-4">
              <span className="text-[14px] text-slate-400 dark:text-slate-500 font-mono italic">
                ID: {id}
              </span>
              <span className="text-[14px] text-slate-400 dark:text-slate-500 font-mono">
                ⭐ {rating?.toFixed(1)}
              </span>
            </div>
          </div>

          {/* FOOTER AREA */}
          <div className="mt-6 pt-5 border-t border-light-700 dark:border-white/5 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                Starting Price
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                €{(minPrice || 0).toFixed(2)}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                Highest Price
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                €{(maxPrice || 0).toFixed(2)}
              </p>
            </div>

            {/* CTA Button: Darker in light mode, lighter in dark mode */}
            <button className="h-10 w-10 rounded-full bg-slate-900 dark:bg-accent text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-lg shadow-accent/10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
