import React from "react";
import {
  Check,
  PartyPopper,
  ArrowRight,
  FileText,
  Send,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreationSuccess = ({ serviceId, isEditMode, status }) => {
  const navigate = useNavigate();

  // Logic to determine content based on status
  const getStatusContent = () => {
    if (isEditMode) {
      return {
        title: "Changes Saved",
        desc: "Your service has been updated successfully.",
        icon: <Check size={48} />,
        color: "bg-blue-500",
        shadow: "shadow-blue-500/40",
      };
    }
    if (status === "draft") {
      return {
        title: "Saved to Drafts",
        desc: "Your progress is safe. You can find this service in your drafts whenever you're ready to finish.",
        icon: <FileText size={48} />,
        color: "bg-orange-500",
        shadow: "shadow-orange-500/40",
      };
    }
    if (status === "review") {
      return {
        title: "Under Review",
        desc: "We've received your request! Our team will review your service. You'll be notified once it's approved.",
        icon: <Clock size={48} />,
        color: "bg-emerald-500",
        shadow: "shadow-emerald-500/40",
      };
    }
    // Fallback for default publish
    return {
      title: "All Set!",
      desc: "Your service is now live and ready for bookings.",
      icon: <PartyPopper size={48} />,
      color: "bg-slate-900 dark:bg-white",
      shadow: "shadow-slate-900/20 dark:shadow-white/10",
    };
  };

  const content = getStatusContent();

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in zoom-in-95 duration-700">
      {/* Dynamic Icon State */}
      <div className="relative mb-10">
        <div
          className={`absolute inset-0 ${content.color} blur-3xl opacity-20 animate-pulse`}
        />
        <div
          className={`relative w-24 h-24 ${content.color} ${content.color === "bg-slate-900 dark:bg-white" ? "text-white dark:text-black" : "text-white"} rounded-[2.5rem] flex items-center justify-center shadow-2xl ${content.shadow} transition-transform duration-500 hover:scale-110`}
        >
          {content.icon}
        </div>
      </div>

      {/* Dynamic Text Content */}
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
          {content.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mx-auto leading-relaxed font-medium">
          {content.desc}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate(`/provider/service/${serviceId}`)}
          className="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 px-8 rounded-[2rem] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
        >
          Preview Service
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <button
          onClick={() => navigate("/provider/dashboard")}
          className="font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CreationSuccess;
