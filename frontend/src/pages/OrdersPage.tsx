import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, createOrder } from '../services/api';
import type { Order, OrderStatus } from '../types/order';
import { LayoutCard } from '../components/LayoutCard';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrderForm } from '../components/OrderForm';

type StatusFilter = 'All' | OrderStatus;

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const totalOrders = orders.length;
  const totalPending = orders.filter((o) => o.status === 'Pending').length;
  const totalCompleted = orders.filter((o) => o.status === 'Completed').length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (typeof o.totalPrice === 'number' ? o.totalPrice : Number(o.totalPrice)),
    0
  );

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders({
        status: statusFilter === 'All' ? undefined : statusFilter,
        search: search.trim() || undefined
      });
      setOrders(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadOrders();
  };

  return (
    <LayoutCard
      title="Orders"
      description="View and filter customer orders. Click a row to see full details."
    >
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Orders
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-50">{totalOrders}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pending
          </div>
          <div className="mt-1 text-xl font-semibold text-amber-300">{totalPending}</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Completed
          </div>
          <div className="mt-1 text-xl font-semibold text-emerald-300">
            {totalCompleted}
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Revenue
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-50">
            ${totalRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between gap-3">
        <form className="flex flex-wrap items-end gap-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Status
          </label>
          <select
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Search by customer or order ID
          </label>
          <input
            type="text"
            placeholder="e.g. Jane Doe or ORD-1001"
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

          <button
            type="submit"
            className="mt-5 inline-flex h-9 items-center rounded-md bg-indigo-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Apply
          </button>
        </form>

        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="inline-flex h-9 items-center rounded-md border border-indigo-500/60 bg-indigo-500/10 px-4 text-sm font-medium text-indigo-100 shadow-sm hover:bg-indigo-500/20"
        >
          {showCreate ? 'Close form' : 'New Order'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-100">Create a new order</h3>
          <OrderForm
            onSubmit={async (data) => {
              await createOrder(data);
              await loadOrders();
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/40">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/60">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Order ID</th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Customer Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">Status</th>
              <th className="px-4 py-2 text-right font-medium text-slate-400">
                Total Price
              </th>
              <th className="px-4 py-2 text-right font-medium text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-400" colSpan={5}>
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-400" colSpan={5}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-900/80 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-xs text-slate-300">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-2 text-slate-100">{order.customerName}</td>
                  <td className="px-4 py-2">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-slate-100">
                    ${order.totalPrice.toFixed ? order.totalPrice.toFixed(2) : order.totalPrice}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-indigo-500 hover:text-indigo-200"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </LayoutCard>
  );
};

