import React, { useEffect, useState, useCallback } from "react";
import {
  User,
  ShieldCheck,
  Mail,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import FilterContainer from "../../../../components/ui/dashboard/FilterContainer";
import adminApis from "../../../../api/adminApis";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    isVerified: undefined,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
      );
      const response = await adminApis.getAllUsers(cleanParams);
      if (response) {
        setUsers(response.data || response || []);
        setMeta({
          page: response.page || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
        });
      }
    } catch (err) {
      console.error("User Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerify = async (id) => {
    try {
      const res = await adminApis.verifyUser(id);
      if (res) fetchUsers();
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const userColumns = [
    {
      header: "Identity",
      render: (user) => (
        <TransactionCell
          id={
            (user.firstName &&
              user.lastName &&
              `${user.firstName} ${user.lastName}`) ||
            user.username ||
            "Anonymous User"
          }
          subtext={`UID: ${user.id?.substring(0, 8)}...`}
          icon={User}
        />
      ),
    },
    {
      header: "Contact",
      render: (user) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm font-black italic">
            <Mail size={12} className="text-zinc-500" />
            {user.email}
          </div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
            {user.phoneNumber || "No Phone"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.isVerified ? (
            <div className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <ShieldCheck size={12} />
              <span className="text-[9px] font-black uppercase">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-500 bg-zinc-500/10 px-3 py-1 rounded-full border border-zinc-500/20">
              <span className="text-[9px] font-black uppercase">
                Unverified
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Joined",
      render: (user) => (
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar size={12} />
          <span className="text-[10px] font-bold uppercase">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      align: "right",
      render: (user) => (
        <ActionGroup
          actions={[
            {
              label: "Verify",
              show: !user.isVerified,
              onClick: () => handleVerify(user.id),
              variant: "emerald",
            },
            {
              label: "View",
              show: true,
              onClick: () => window.open(`/user/${user.id}`, "_blank"),
              variant: "outline",
              icon: <ExternalLink size={12} />,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-5">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            User Registry
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Manage Credentials & Verification Status
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <FilterContainer
        searchValue={filters.search}
        onSearchChange={(val) => handleFilterChange("search", val)}
      >
        <div className="flex gap-2 pt-2">
          <FilterToggle
            label="All Users"
            active={filters.isVerified === undefined}
            onClick={() => handleFilterChange("isVerified", undefined)}
          />
          <FilterToggle
            label="Unverified"
            active={filters.isVerified === false}
            onClick={() => handleFilterChange("isVerified", false)}
          />
          <FilterToggle
            label="Verified"
            active={filters.isVerified === true}
            onClick={() => handleFilterChange("isVerified", true)}
          />
        </div>
      </FilterContainer>

      {/* TABLE */}
      <div className="relative">
        <MultiUseTable
          columns={userColumns}
          data={users}
          loading={loading}
          pagination={meta}
          onPageChange={(p) => handleFilterChange("page", p)}
        />
      </div>
    </div>
  );
}

const FilterToggle = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all ${
      active
        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white"
        : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-white/5 hover:border-zinc-400"
    }`}
  >
    {label}
  </button>
);
