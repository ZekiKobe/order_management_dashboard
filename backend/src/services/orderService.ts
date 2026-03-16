import { Op } from 'sequelize';
import { Order, OrderStatus } from '../models/Order';

interface OrderFilters {
  status?: OrderStatus;
  search?: string;
}

export const orderService = {
  async listOrders(filters: OrderFilters = {}) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${filters.search}%` } },
        { orderId: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    return Order.findAll({ where, order: [['createdAt', 'DESC']] });
  },

  async getOrderById(id: number) {
    return Order.findByPk(id);
  },

  async createOrder(payload: {
    orderId: string;
    customerName: string;
    status?: OrderStatus;
    totalPrice: number;
  }) {
    return Order.create(payload);
  },

  async updateOrder(
    id: number,
    payload: Partial<{
      orderId: string;
      customerName: string;
      status: OrderStatus;
      totalPrice: number;
    }>
  ) {
    const order = await Order.findByPk(id);
    if (!order) {
      return null;
    }
    await order.update(payload);
    return order;
  },
};

