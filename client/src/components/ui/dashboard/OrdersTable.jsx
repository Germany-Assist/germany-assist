import React from "react";
import { Search, Filter, Download, ChevronUp, ChevronDown } from "lucide-react";

const statusStyles = {
  pending: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  active: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  disputed: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg}`}>
      <span className={`w-1 h-1 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export function OrdersTable({
  data = [],
  loading = false,
  emptyMessage = "No orders found",
  onRowClick,
  filterConfig = {},
  showFilters = true,
}) {
  const { status = "all", search = "" } = filterConfig;

  const handleSearch = (e) => {
    // TODO: implement search
  };

  const handleExport = () => {
    const headers = ["Service", "Client", "Order ID", "Date", "Due", "Amount", "Status"];
    const rows = data.map(row => [
      row.service, row.client, row.orderId, row.date, row.due, row.amount, row.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filterTabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "disputed", label: "Disputed" },
  ];

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 animate-pulse">
        <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex bg-zinc-50 dark:bg-zinc-800/50 rounded-lg overflow-hidden">
              {filterTabs.map(tab => (
                <button
                  key={tab.value}
                  className={`px-3 py-1.5 text-[11.5px] transition-colors ${
                    (status || "all") === tab.value
                      ? "bg-[#024CEE] text-white font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-[#024CEE]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1"></div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search orders…"
                value={search}
                onChange={handleSearch}
                className="pl-8 pr-3 py-1.5 w-48 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:border-[#024CEE]"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 hover:border-[#024CEE] hover:text-[#024CEE] transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 hover:border-[#024CEE] hover:text-[#024CEE] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Service</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Client</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Order ID</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Date</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Due</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Amount</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Status</th>
              <th className="text-left px-4 py-3 text-[10.5px] font-semibold uppercase text-zinc-500 dark:text-zinc-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                    row.isNew ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100">
                      {row.service}
                      {row.isNew && (
                        <span className="ml-2 text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{row.sub}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100">{row.client}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{row.clientId}</div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-zinc-500">{row.orderId}</td>
                  <td className="px-4 py-3 text-[12px] text-zinc-900 dark:text-zinc-100">{row.date}</td>
                  <td className="px-4 py-3 text-[12px] text-amber-600">{row.due}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-zinc-900 dark:text-zinc-100">{row.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11.5px] font-medium text-[#024CEE] cursor-pointer hover:underline">
                      Review
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;