import { useState } from 'react';
import type { OrderStatus } from '../types/order';

interface Props {
  onSubmit: (data: {
    orderId: string;
    customerName: string;
    status: OrderStatus;
    totalPrice: number;
  }) => Promise<void> | void;
  onCancel?: () => void;
}

export const OrderForm = ({ onSubmit, onCancel }: Props) => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [totalPrice, setTotalPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(totalPrice);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError('Total price must be a non‑negative number');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        orderId: orderId.trim(),
        customerName: customerName.trim(),
        status,
        totalPrice: numericPrice
      });
      setOrderId('');
      setCustomerName('');
      setStatus('Pending');
      setTotalPrice('');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Order ID
          </label>
          <input
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-1001"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Customer Name
          </label>
          <input
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Jane Doe"
            required
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Status
          </label>
          <select
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Total Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="e.g. 120.50"
            required
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

