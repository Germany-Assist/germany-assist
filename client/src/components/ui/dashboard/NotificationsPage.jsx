import React, { useEffect, useState, useCallback } from "react";
import { getNotifications, markNotifications, toggleNotificationsStatus } from "../../../api/notificationaApi"; 
import NotificationsTable from "../../ui/dashboard/NotificationTable";
import {markAllNotificationsAsRead} from "../../../api/notificationaApi";
import { useProfile } from "../../../contexts/ProfileContext";
import { Filter ,MailCheck,Check} from "lucide-react";
import StatusModal from "../StatusModal";
const NotificationsPage = ({role}) => {

    const { profile, fetchProfile, setProfile } = useProfile();  
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);  
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    readStatus: "" 
    });
    const [selectedIds, setSelectedIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [statusModal, setStatusModal] = useState(null);
    const showError = (error) => {
    setStatusModal({
      isOpen: true,
      type: "error",
      message: getErrorMessage(error),
      onClose() {
        setStatusModal(null);
      },
    });
    };
      const fetchNotifications = useCallback(async () => {
      try {
        setLoading(true);

        const params = {
        page: filters.page,
        limit: filters.limit,
          ...(filters.readStatus === "read" && { isRead: true }),
          ...(filters.readStatus === "unread" && { isRead: false }),
          ...(filters.readStatus === "all" && { isRead: "all" }),
        };

        const res = await getNotifications(params);

        setNotifications(res.notifications || []);
        setSelectedIds([]); // reset selection
        setTotalPages(res.meta?.pages || 1);

      } catch (error) {
        console.error("Error fetching notifications:", error);
        showError(error);
      } finally {
        setLoading(false);
      }
      }, [filters]);
  
    useEffect(() => {
      fetchNotifications();
    }, [filters,fetchNotifications]);
    
      const handlePageChange = (newPage) => {
        setSelectedIds([]); // reset selection
        setFilters((prev) => ({
        ...prev,
        page: newPage
        }));
      };
    
      // Full modification: View opens Modal + makes the message read
      const handleView = async (notification) => {
        setSelectedNotification(notification);
        // open Modal
        setIsModalOpen(true);
        
        // If it is unread
        if (!notification.isRead) {
          try {
            // This modifies the read state in the DB.
            await markNotifications([notification.id]);
            // (Optimistic Update)
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === notification.id ? { ...n, isRead: true } : n
              )
            );

          
              setProfile(prev => ({
                ...prev,
                unReadNotifications: Math.max(0, prev.unReadNotifications - 1)
              }));
          } catch (error) {
            console.error("Error marking as read:", error);
            showError(error);
          }
        }
      };
    
      const handleFilterChange = (key, value) => {
        setSelectedIds([]); // reset selection
        setFilters((prev) => ({
          ...prev,
          [key]: value,
          page: 1
        }));
      };
    
      const handleMarkAllAsRead = async () => {
      try {
        await markAllNotificationsAsRead();
        // update interface
        fetchNotifications();
        // update notification counter
        setProfile(prev => ({
          ...prev,
          unReadNotifications: 0
        }));
      
      } catch (error) {
        showError(error);
      }
    
      };
    
      const toggleSelectNotification = (id) => {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((nId) => nId !== id)
          : [...prev, id]
      );
      };
    
      const toggleSelectAll = (checked) => {
    
      if (checked) {
        setSelectedIds(notifications.map(n => n.id));
      } else {
        setSelectedIds([]);
      }
    
      };
    

        const handleMarkAsReadOrUnread = async (markAs) => {
          console.log("selectedIds:", selectedIds);
          if (!selectedIds.length) return;

          try {

            await toggleNotificationsStatus(selectedIds, markAs);

            // Optimistic UI
            setNotifications((prev) =>
              prev.map((n) =>
                selectedIds.includes(n.id)
                  ? { ...n, isRead: markAs === "read" }
                  : n
              )
            );

            setSelectedIds([]);
            setProfile(prev => {
              let delta = 0;

              notifications.forEach(n => {
                if (selectedIds.includes(n.id)) {
                  if (markAs === "read" && !n.isRead) delta--;     
                  if (markAs === "unread" && n.isRead) delta++;    
                }
              });

              return {
                ...prev,
                unReadNotifications: Math.max(
                  0,
                  (prev.unReadNotifications || 0) + delta
                )
              };
            });
           

          } catch (error) {
            console.error(error);
            showError(error);
          }

        };
    return (
        <div className="p-10 space-y-8">
    <div className="flex flex-wrap items-center gap-4">
        
        <div className="relative group min-w-[160px]">
        <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            size={14}
        />
        <select
            value={filters.readStatus}
            onChange={(e) => handleFilterChange("readStatus", e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 pl-10 pr-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none focus:ring-2 ring-blue-500/20 transition-all outline-none cursor-pointer"
        >
          <option value="">Unread</option>
          <option value="all">All Notifications</option>
          <option value="read">Read</option>
          {/* <option value="unread">Unread</option> */}
        </select>
        </div>

        
        <div className="relative group">

        <button
          onClick={() => setOpen(!open)}
          disabled={!selectedIds.length}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-2xl
            text-[10px] font-black uppercase tracking-widest
            border border-zinc-200 dark:border-white/5
            bg-white dark:bg-zinc-900
            transition-all
            ${selectedIds.length
              ? "hover:bg-zinc-100 dark:hover:bg-white/5"
              : "opacity-40 cursor-not-allowed"
            }
          `}
        >
          <Check size={16} />
          Actions
        </button>

        {/* Dropdown */}
        {open && selectedIds.length > 0 && (
        <div className="absolute top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg z-50">
          
          <button
            onClick={() => {
              handleMarkAsReadOrUnread("read");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            Mark as read
          </button>

          <button
            onClick={() => {
              handleMarkAsReadOrUnread("unread");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            Mark as unread
          </button>

        </div>
       )}

       </div>

        
        <button
        onClick={handleMarkAllAsRead}
        disabled={!profile?.unReadNotifications}
        className={`
            flex items-center gap-3 px-6 py-3 rounded-2xl
            text-[10px] font-black uppercase tracking-widest whitespace-nowrap
            border border-zinc-200 dark:border-white/5
            transition-all focus:ring-2 ring-blue-500/20
            ${profile?.unReadNotifications > 0 
            ? "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5" 
            : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 cursor-not-allowed"}
        `}
        >
        <MailCheck size={16} className="shrink-0" />
        <span>Mark all as read</span>
        
        {profile?.unReadNotifications > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[9px] bg-blue-500 text-white rounded-full font-bold">
            {profile?.unReadNotifications}
            </span>
        )}
        </button>
    </div>

    
    <NotificationsTable
        notifications={notifications}
        loading={loading}
        pagination={{ page: filters.page, totalPages }}
        onPageChange={handlePageChange}
        onView={handleView}
        selectedIds={selectedIds}
        toggleSelectNotification={toggleSelectNotification}
        toggleSelectAll={toggleSelectAll}
    />
    
    <StatusModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      type="info"
      message={selectedNotification?.message || ""}
      buttonText="Close"
    />

    {statusModal && (
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.onClose}
        type={statusModal.type}
        message={statusModal.message}
      />
    )}
    </div>
    )
}

export default NotificationsPage