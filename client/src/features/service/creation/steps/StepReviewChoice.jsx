import { FileText, Send, ChevronLeft, CheckCircle2, Clock } from "lucide-react";

const StepReviewChoice = ({
  onBack,
  data,
  onComplete,
  onUpdate,
  isEditMode,
}) => {
  const handleChoiceSelection = (choice) => {
    onUpdate({ requestedStatus: choice });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Ready to go?
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          Choose how you want to proceed with your service listing.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Draft Option */}
        <button
          type="button"
          onClick={() => handleChoiceSelection("draft")}
          className={`group flex items-start gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
            data.requestedStatus === "draft"
              ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
              : "border-zinc-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div
            className={`p-3 rounded-xl ${data.requestedStatus === "draft" ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}
          >
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Save as Draft
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Keep your progress private. You can finish and publish it whenever
              you're ready.
            </p>
          </div>
          {data.requestedStatus === "draft" && (
            <CheckCircle2 className="text-orange-500" size={24} />
          )}
        </button>

        {/* Submit Review Option */}
        <button
          type="button"
          onClick={() => handleChoiceSelection("review")}
          className={`group flex items-start gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
            data.requestedStatus === "review"
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
              : "border-zinc-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div
            className={`p-3 rounded-xl ${data.requestedStatus === "review" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}
          >
            <Send size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Request Review
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Submit your service to our team. Once approved, it will go live
              for customers to book.
            </p>
          </div>
          {data.requestedStatus === "review" && (
            <CheckCircle2 className="text-emerald-500" size={24} />
          )}
        </button>
      </div>

      {/* Helpful Hint */}
      <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
        <Clock className="text-slate-400" size={20} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reviews typically take 24-48 hours. You’ll receive an email
          notification once it's live.
        </p>
      </div>

      {/* Navigation */}
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
          disabled={!data.requestedStatus}
          onClick={onComplete}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-20 ${
            data.requestedStatus === "review"
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 dark:bg-white text-white dark:text-black"
          }`}
        >
          {isEditMode ? "Update Status" : "Confirm & Finish"}
        </button>
      </div>
    </div>
  );
};

export default StepReviewChoice;
