import React from "react";

const MetricCard = ({
  title,
  amount,
  icon: Icon,
  sub,
  variant = "default",
  isCount = false,
}) => {
  const styles = {
    default: {
      card: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100",
      icon: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
      label: "text-zinc-500 dark:text-zinc-400",
    },
    blue: {
      card: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-300",
      icon: "bg-blue-600 text-white shadow-md shadow-blue-500/20",
      label: "text-blue-600/70 dark:text-blue-400/70",
    },
    red: {
      card: "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-300",
      icon: "bg-red-500 text-white shadow-md shadow-red-500/20",
      label: "text-red-600/70 dark:text-red-400/70",
    },
    yellow: {
      card: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-300",
      icon: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
      label: "text-amber-600/70 dark:text-amber-400/70",
    },
    green: {
      card: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      icon: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
      label: "text-emerald-600/70 dark:text-emerald-400/70",
    },
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <div
      className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 group 
      hover:shadow-2xl hover:-translate-y-1 ${currentStyle.card}`}
    >
      {/* Background Decorative Glow (Optional for extra "Pop") */}
      <div className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 bg-current transition-opacity group-hover:opacity-20" />

      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${currentStyle.icon}`}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div>
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5 ${currentStyle.label}`}
        >
          {title}
        </p>
        <h2 className="text-4xl font-black tracking-tighter sm:text-3xl lg:text-4xl">
          {isCount ? amount : `${Number(amount).toLocaleString()}`}
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-tight opacity-70`}
          >
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
