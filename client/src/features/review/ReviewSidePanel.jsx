import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { fetchAllReviewsApi } from "../../api/profile";
import { X } from "lucide-react";

function ReviewSidePanel({ isSidePanelOpen, setIsSidePanelOpen, serviceId }) {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    (async () => {
      if (isSidePanelOpen) {
        //TODO set loading
        const data = await fetchAllReviewsApi(serviceId);
        setReviews(data);
      }
    })();
  }, [serviceId, isSidePanelOpen]);
  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
        isSidePanelOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className="absolute inset-0 bg-light-950/60 dark:bg-dark-950/80 backdrop-blur-sm"
        onClick={() => setIsSidePanelOpen(false)}
      />

      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-light-950 dark:bg-dark-950 border-l border-light-700 dark:border-white/10 shadow-2xl transition-transform duration-500 transform ${
          isSidePanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="p-8 border-b border-light-700 dark:border-white/5 flex items-center justify-between bg-light-900/50 dark:bg-black/20">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                All Reviews
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                {reviews.length} Verified Experiences
              </p>
            </div>
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="p-2 hover:bg-light-700 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {reviews.map((review, idx) => (
              <div
                key={review.id || idx}
                className="border-b border-light-700 dark:border-white/5 pb-8 last:border-0"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSidePanel;
