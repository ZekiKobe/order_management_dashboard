import type { OrderStatus } from '../types/order';

interface Props {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: Props) => {
  const isPending = status === 'Pending';
  const color = isPending
    ? 'bg-amber-500/15 text-amber-300 border-amber-400/40'
    : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${color}`}
    >
      <span
        className={`mr-1 h-1.5 w-1.5 rounded-full ${
          isPending ? 'bg-amber-300' : 'bg-emerald-300'
        }`}
      />
      {status}
    </span>
  );
};

