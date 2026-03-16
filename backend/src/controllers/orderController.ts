import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { OrderStatus } from '../models/Order';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;

    const filters: { status?: OrderStatus; search?: string } = {};
    if (status === 'Pending' || status === 'Completed') {
      filters.status = status;
    }
    if (typeof search === 'string' && search.trim().length > 0) {
      filters.search = search.trim();
    }

    const orders = await orderService.listOrders(filters);
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid order id' },
      });
    }

    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' },
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, customerName, status, totalPrice } = req.body;

    const newOrder = await orderService.createOrder({
      orderId,
      customerName,
      status,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid order id' },
      });
    }

    const updated = await orderService.updateOrder(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' },
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

