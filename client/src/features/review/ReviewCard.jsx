import { Star } from "lucide-react";

const ReviewCard = ({ review }) => (
  <div className="p-5 space-y-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-light-700 dark:border-white/5 shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div className="flex items-center gap-4">
      {/* User Initial Circle */}
      <div className="flex-shrink-0 h-10 w-10 bg-blue-600/10 dark:bg-accent/10 rounded-full flex items-center justify-center text-blue-600 dark:text-accent font-black border border-blue-600/10 dark:border-accent/20 uppercase text-xs tracking-tighter">
        {review.user?.name?.charAt(0) || "U"}
      </div>

      <div className="min-w-0 flex-1">
        {/* User Name with truncation if too long */}
        <h4 className="font-bold text-slate-900 dark:text-white leading-tight capitalize text-sm truncate">
          {review.user?.name}
        </h4>

        {/* Star Rating */}
        <div className="flex gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < review.rating
                  ? "fill-blue-600 text-blue-600 dark:fill-accent dark:text-accent"
                  : "text-slate-200 dark:text-white/5"
              }
            />
          ))}
        </div>
      </div>
    </div>

    {/* Review Body with proper line breaking */}
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light italic text-sm whitespace-pre-line break-words line-clamp-3">
      "{review.body}"
    </p>
  </div>
);

export default ReviewCard;
