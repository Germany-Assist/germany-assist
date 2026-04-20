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
import {
  serviceProviderGetAllOrders,
  serviceProviderFinanceInit,
  serviceProviderCloseOrder,
} from "../../../../api/serviceProviderApis";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import OrderStatusBadge from "../../../../components/ui/dashboard/OrderStatusBadge";
import MetricCard from "../../../../components/ui/dashboard/MetricCard";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import { getErrorMessage } from "../../../../api/errorMessages";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";

const ServiceProviderFinance = () => {
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
  const [statusModalCon, setStatusModalCon] = useState(null);

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
      const response = await serviceProviderFinanceInit();
      if (response.success) {
        setMetrics({
          grossTotal: response.data.grossTotal,
          escrow: response.data.escrow,
          balance: response.data.balance,
          disputes: response.data.disputes,
        });
        // setOrders(response.data.orders.data);
        setMeta(response.data.orders.meta);
      }
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        onClose: () => setStatusModalCon(null),
        message: getErrorMessage(err),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCloseOrder = async (id) => {
    try {
      const res = await serviceProviderCloseOrder(id);
    } catch (error) {
      setStatusModalCon({
        isOpen: true,
        onClose: () => setStatusModalCon(null),
        message: getErrorMessage(error),
        type: "error",
      });
    }
    //TODO update the fields
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
      render: (row) => {
        return (
          <ActionGroup
            actions={[
              {
                label: "Close Order",
                show: row.status === "active" && row.serviceType === "oneTime",
                loading: processingId === row.orderId,
                onClick: () => handleCloseOrder(row.orderId),
                variant: "primary",
              },
              {
                label: "Go To Dispute Center",
                show: Boolean(row.dispute),
                loading: processingId === row.orderId,
                onClick: () => handleCloseOrder(row.orderId),
                variant: "danger",
              },
            ]}
          />
        );
      },
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
    } catch (err) {
      setStatusModalCon({
        isOpen: true,
        onClose: () => setStatusModalCon(null),
        message: getErrorMessage(err),
        type: "error",
      });
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    initDashboard();
  }, []);

  useEffect(() => {
    fetchFilteredData();
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
        <DashboardHeader title={"finance"} subtitle={"financial console"} />
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
          <MetricCard
            title="Balance"
            amount={metrics.balance}
            icon={ShieldAlert}
            sub="Available to checkout"
            variant="green"
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
  );
};

export default ServiceProviderFinance;
