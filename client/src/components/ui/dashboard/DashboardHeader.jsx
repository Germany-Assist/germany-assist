import React from "react";
import { Plus } from "lucide-react";

const DashboardHeader = ({
  title,
  subtitle,
  buttonText,
  onAction,
  icon = <Plus size={16} />,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full mb-10">
      <div>
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {buttonText && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
        >
          {icon} {buttonText}
        </button>
      )}
    </div>
  );
};

export default DashboardHeader;
