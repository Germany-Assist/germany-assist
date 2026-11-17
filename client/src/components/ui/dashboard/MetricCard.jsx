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
      card: "bg-white border-zinc-200 text-zinc-900",
      icon: "bg-zinc-100 text-zinc-600",
      label: "text-zinc-500",
    },
    blue: {
      card: "bg-blue-50/50 border-blue-100 text-blue-700",
      icon: "bg-blue-600 text-white shadow-md shadow-blue-500/20",
      label: "text-blue-600/70",
    },
    red: {
      card: "bg-red-50/50 border-red-100 text-red-700",
      icon: "bg-red-500 text-white shadow-md shadow-red-500/20",
      label: "text-red-600/70",
    },
    yellow: {
      card: "bg-amber-50/50 border-amber-100 text-amber-700",
      icon: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
      label: "text-amber-600/70",
    },
    green: {
      card: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
      icon: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
      label: "text-emerald-600/70",
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
