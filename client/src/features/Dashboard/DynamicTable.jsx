import React, { useMemo, useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { ImCross } from "react-icons/im";
const DynamicTable = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (col) => {
    if (!col.sortable) return;

    setSortConfig((prev) => ({
      key: col.key,
      direction:
        prev?.key === col.key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const levelCalculator = (row) => {
    let bgStyle;
    switch (row.level) {
      case "pending":
        bgStyle = "bg-yellow-100";
        break;
      case "ready":
        bgStyle = "bg-green-100";
        break;
      case "accepted":
        bgStyle = "bg-blue-100";
        break;
      case "alert":
        bgStyle = "bg-red-100";
        break;
      default:
        bgStyle = "";
        break;
    }
    return `hover:bg-gray-400 transition-colors ${bgStyle}`;
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gradient-to-b from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                className={`px-4 py-3 text-left font-semibold text-gray-600
                  ${col.sortable ? "cursor-pointer select-none" : ""}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{col.key}</span>

                  {sortConfig?.key === col.key && (
                    <span className="text-xs text-gray-400">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {sortedData.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex} className={levelCalculator(row)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-gray-700 first:rounded-l-lg last:rounded-r-lg items-center justify-center"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
