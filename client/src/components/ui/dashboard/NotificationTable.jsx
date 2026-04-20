import React from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import MultiUseTable from "../../ui/dashboard/MultiUseTable";

export default function NotificationsTable({
  notifications,
  loading,
  pagination,
  onPageChange,
  onMarkAsRead,
  onView,
  selectedIds,
  toggleSelectNotification,
  toggleSelectAll
}) {
// update the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
  const columns = [
      {
      header: (
        <input
          type="checkbox"
          checked={
            notifications.length > 0 &&
            selectedIds.length === notifications.length
          }
          onChange={(e) => toggleSelectAll(e.target.checked)}
          className="w-4 h-4"
        />
      ),
      key: "select",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds?.includes(row.id)}
          onChange={() => toggleSelectNotification(row.id)}
          className="w-4 h-4"
        />
      )
    },
    {
      header: "Message",
      key: "message",
    },
    {
      header: "Date",
      key: "createdAt",
      render: (row) =>(
        <span className="whitespace-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),  
    },
    {
      header: "Action",
      key: "action",
      align: "right",
      render: (row) => (
        <div className="">

          <button
            onClick={() => onView(row)}
            disabled={row.isRead}
            className={`
              px-4 py-2 text-xs rounded-lg border transition
              ${
                !row.isRead
                  ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 cursor-not-allowed"
              }
            `}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return ( 
    <MultiUseTable
      columns={columns}
      data={notifications}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      rowClassName={(row) =>
      !row.isRead ? "bg-blue-100 dark:bg-gray-800" : ""
      }
      emptyMessage="No notifications found"

    />
  );
}