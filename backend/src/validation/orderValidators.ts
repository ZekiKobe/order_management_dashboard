import { OrderStatus } from '../models/Order';

const isValidStatus = (value: any): value is OrderStatus =>
  value === 'Pending' || value === 'Completed';

const toNumber = (value: any): number | null => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const validateCreateOrder = (body: any) => {
  const errors: string[] = [];
  const value: any = {};

  if (!body || typeof body !== 'object') {
    return { error: 'Body must be an object' };
  }

  if (!body.orderId || typeof body.orderId !== 'string') {
    errors.push('orderId is required and must be a string');
  } else {
    value.orderId = body.orderId.trim();
  }

  if (!body.customerName || typeof body.customerName !== 'string') {
    errors.push('customerName is required and must be a string');
  } else {
    value.customerName = body.customerName.trim();
  }

  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      errors.push('status must be one of: Pending, Completed');
    } else {
      value.status = body.status;
    }
  }

  const price = toNumber(body.totalPrice);
  if (price === null || price < 0) {
    errors.push('totalPrice is required and must be a non-negative number');
  } else {
    value.totalPrice = price;
  }

  if (errors.length > 0) {
    return { error: errors.join('; ') };
  }

  return { value };
};

export const validateUpdateOrder = (body: any) => {
  const errors: string[] = [];
  const value: any = {};

  if (!body || typeof body !== 'object') {
    return { error: 'Body must be an object' };
  }

  if (body.orderId !== undefined) {
    if (typeof body.orderId !== 'string') {
      errors.push('orderId must be a string');
    } else {
      value.orderId = body.orderId.trim();
    }
  }

  if (body.customerName !== undefined) {
    if (typeof body.customerName !== 'string') {
      errors.push('customerName must be a string');
    } else {
      value.customerName = body.customerName.trim();
    }
  }

  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      errors.push('status must be one of: Pending, Completed');
    } else {
      value.status = body.status;
    }
  }

  if (body.totalPrice !== undefined) {
    const price = toNumber(body.totalPrice);
    if (price === null || price < 0) {
      errors.push('totalPrice must be a non-negative number');
    } else {
      value.totalPrice = price;
    }
  }

  if (errors.length > 0) {
    return { error: errors.join('; ') };
  }

  return { value };
};

