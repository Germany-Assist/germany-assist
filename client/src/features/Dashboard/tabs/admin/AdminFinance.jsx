import React, { useEffect, useState, useCallback } from "react";
import {
  ShieldAlert,
  Timer,
  Loader2,
  TrendingUp,
  Gavel,
  Filter,
  AlertTriangle,
  History,
  LayoutGrid,
} from "lucide-react";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import OrderStatusBadge from "../../../../components/ui/dashboard/OrderStatusBadge";
import MetricCard from "../../../../components/ui/dashboard/MetricCard";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import { getAllFinanceStatistical } from "../../../../api/adminApis";

const AdminFinance = () => {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    grossTotal: 0,
    escrow: 0,
    disputes: 0,
    balance: 0,
  });
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    type: "",
    onlyDisputed: false,
  });

  const initDashboard = async () => {
    setLoading(true);
    try {
      const response = await getAllFinanceStatistical();
      if (response.success) {
        setMetrics({
          grossTotal: response.data.grossTotal,
          escrow: response.data.escrow,
          disputes: response.data.disputes,
        });
        setOrders(response.data.orders.data);
        setMeta(response.data.orders.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Transaction",
      render: (order) => {
        const isDisputed = order.dispute !== null;
        return (
          <TransactionCell
            id={order.orderId}
            subtext={new Date(order.createdAt).toLocaleDateString()}
            icon={isDisputed ? Gavel : History}
            variant={isDisputed ? "danger" : "default"}
          />
        );
      },
    },
    {
      header: "Status",
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      header: "Net Payout",
      render: (row) => (
        <CurrencyCell
          amount={row.amountToPay || row.amount}
          isDisputed={!!row.dispute}
        />
      ),
    },
    {
      header: "Action",
      align: "right",
      render: (row) => (
        <ActionGroup
          actions={[
            {
              label: "Close Order",
              show: row.status === "active" && row.type === "oneTime",
              loading: processingId === row.orderId,
              onClick: () => handleCloseOrder(row.orderId),
              variant: "primary",
            },
          ]}
        />
      ),
    },
  ];
  // Specialized cell for Currency
  const CurrencyCell = ({ amount, isDisputed }) => (
    <p
      className={`text-xl font-black italic tracking-tighter ${isDisputed ? "text-red-500" : "text-blue-600 dark:text-blue-400"}`}
    >
      ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </p>
  );

  const fetchFilteredData = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.onlyDisputed && { onlyDisputed: true }),
      };
      const response = await serviceProviderGetAllOrders(params);
      setOrders(response.data || []);
      setMeta(response.meta || { page: 1, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    initDashboard();
  }, []);
  useEffect(() => {
    if (!loading) fetchFilteredData();
  }, [filters, fetchFilteredData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-zinc-700" size={40} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic dark:text-white">
              FINANCE
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
              Operational Ledger & Payouts
            </p>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Gross Volume"
            amount={metrics.grossTotal}
            icon={TrendingUp}
            sub="Total revenue generated"
          />
          <MetricCard
            title="Safety Escrow"
            amount={metrics.escrow}
            icon={Timer}
            sub="Held for 7-day window"
            variant="blue"
          />
          <MetricCard
            title="Disputed"
            amount={metrics.disputes}
            icon={ShieldAlert}
            sub="Orders under review"
            variant="red"
            isCount
          />
        </div>
        {/* TODO i should create reuseable component */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative group col-span-1">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={14}
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none focus:ring-2 ring-blue-500/20 transition-all outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending_completion">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="relative group col-span-1">
            <LayoutGrid
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={14}
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none"
            >
              <option value="">All Types</option>
              <option value="oneTime">One-Time</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>

          <button
            onClick={() =>
              handleFilterChange("onlyDisputed", !filters.onlyDisputed)
            }
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filters.onlyDisputed
                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-red-500/50"
            }`}
          >
            <AlertTriangle size={14} /> Only Disputed
          </button>
        </div>

        {/* LEDGER */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden relative">
          {tableLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          )}

          <div className="overflow-x-auto">
            <MultiUseTable
              columns={columns}
              data={orders}
              loading={tableLoading}
              pagination={meta}
              onPageChange={(newPage) =>
                setFilters((f) => ({ ...f, page: newPage }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;
