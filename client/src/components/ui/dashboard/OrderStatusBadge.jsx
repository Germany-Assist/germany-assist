const OrderStatusBadge = ({ status }) => {
  const styles = {
    active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    pending_completion: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-500 border-zinc-500/10",
    paid: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${styles[status] || styles.cancelled}`}
    >
      <span
        className={`w-1 h-1 rounded-full bg-current ${status === "active" ? "animate-pulse" : ""}`}
      />
      {status.replace("_", " ")}
    </div>
  );
};
export default OrderStatusBadge;
