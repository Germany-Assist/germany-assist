import React from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const MultiUseTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  emptyMessage = "No records found",
  rowClassName,
}) => {
  return (
    /* 1. THE MAIN WRAPPER: Handles the roundness and the vibrant background */
    <div className="relative rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
      {/* 2. THE COOL COLOR LAYER: Subtle but bright glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/10 blur-[100px]" />
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}

      {/* 3. THE SCROLL AREA: No padding here to avoid "chopping" */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-10 py-7 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`
                    group transition-colors duration-200 
                    hover:bg-blue-500/[0.02] dark:hover:bg-blue-400/[0.02]
                    ${rowClassName ? rowClassName(row) : ""}
                    `}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-10 py-7 text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                        col.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-8 py-32 text-center text-zinc-400 uppercase text-[10px] font-bold tracking-widest"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. PAGINATION: Grounded at the bottom */}
      {pagination && (
        <div className="px-10 py-8 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.01]">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Page{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {pagination.page}
            </span>
            <span className="opacity-30 mx-2">/</span>
            {pagination.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 hover:border-blue-500/50 transition-all active:scale-90 disabled:opacity-20"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 hover:border-blue-500/50 transition-all active:scale-90 disabled:opacity-20"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUseTable;
