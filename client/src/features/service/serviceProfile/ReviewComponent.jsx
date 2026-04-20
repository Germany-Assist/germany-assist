import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  PenLine,
  X,
  Send,
  ChevronRight,
} from "lucide-react";
import ReviewCard from "../../review/ReviewCard";
import ReviewSidePanel from "../../review/ReviewSidePanel";
import {
  createNewReviewApi,
  updateExistingReviewApi,
} from "../../../api/profile";

const ReviewsSection = ({
  reviews = [],
  totalReviews = 0,
  rating = 0,
  serviceId,
  canReview = false,
  existingReview = null,
}) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formBody, setFormBody] = useState("");

  useEffect(() => {
    if (existingReview && isModalOpen) {
      setFormRating(existingReview.rating);
      setFormBody(existingReview.body);
    }
  }, [existingReview, isModalOpen]);

  const handleSubmit = async () => {
    const payload = {
      id: serviceId,
      rating: formRating,
      body: formBody,
    };
    //TODO add something to confirm maybe i will create something universal
    if (existingReview) {
      await updateExistingReviewApi(payload);
    } else {
      await createNewReviewApi(payload);
    }

    setIsModalOpen(false);
  };

  const isEditing = !!existingReview;

  return (
    <div className="border-t border-light-700 dark:border-white/5 pt-12 mt-12">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star size={24} className="fill-accent text-accent" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {rating > 0 ? rating.toFixed(1) : "New"}
            </h3>
          </div>
          <span className="text-2xl text-light-700 dark:text-white/10">|</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {totalReviews} Reviews
          </h3>
        </div>
      </div>

      {canReview && (
        <div className="mb-10 p-8 rounded-[2.5rem] bg-light-900 dark:bg-zinc-900/80 border border-light-700 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">
              {isEditing ? "Update your feedback" : "Share your thoughts"}
            </h4>
            <p className="text-slate-600 dark:text-slate-200 text-[15px] font-semibold leading-relaxed">
              {isEditing
                ? "You've already reviewed this service. Want to change something?"
                : "Help the community by sharing your experience."}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-accent hover:brightness-110 text-white px-8 py-4 rounded-[1.25rem] font-bold text-xs uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl shadow-accent/30 shrink-0"
          >
            <PenLine size={18} />
            {isEditing ? "Edit Review" : "Leave a Review"}
          </button>
        </div>
      )}

      {/* Main Page Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.slice(0, 4).map((review, idx) => (
          <ReviewCard key={review.id || idx} review={review} />
        ))}
      </div>

      {/* Side Panel Trigger */}
      <div className="mt-12">
        <button
          onClick={() => setIsSidePanelOpen(true)}
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-accent transition-colors"
        >
          Show all reviews
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <ReviewSidePanel
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        serviceId={serviceId}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-[#121212] w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-light-700 dark:border-white/10 p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                {isEditing ? "Edit Review" : "Leave a Review"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-slate-200 hover:text-accent transition-colors p-2"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-10">
              <div>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-5 block">
                  Rating
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={36}
                        className={`${
                          star <= formRating
                            ? "fill-accent text-accent"
                            : "text-slate-200 dark:text-white/20"
                        } transition-all hover:scale-110 active:scale-90`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-5 block">
                  Your Experience
                </label>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-lg font-light"
                  placeholder="What did you think of the service?"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-accent text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-accent/30 hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <Send size={20} />
                {isEditing ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
