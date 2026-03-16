import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import type { Order } from '../types/order';
import { LayoutCard } from '../components/LayoutCard';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  return (
    <LayoutCard
      title="Order Details"
      description="View detailed information about a single order."
    >
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-indigo-500 hover:text-indigo-200"
        >
          ← Back to orders
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading order...</p>}
      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </div>
      )}

      {!loading && !error && !order && (
        <p className="text-sm text-slate-400">Order not found.</p>
      )}

      {order && (
        <div className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Order ID
              </div>
              <div className="mt-1 font-mono text-sm text-slate-100">
                {order.orderId}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Customer
              </div>
              <div className="mt-1 text-sm text-slate-100">{order.customerName}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </div>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total Price
              </div>
              <div className="mt-1 text-sm text-slate-100">
                ${order.totalPrice.toFixed ? order.totalPrice.toFixed(2) : order.totalPrice}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created At
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Last Updated
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {new Date(order.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutCard>
  );
};

