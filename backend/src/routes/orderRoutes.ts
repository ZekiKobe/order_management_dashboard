import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from '../controllers/orderController';
import { validateRequest } from '../middleware/validateRequest';
import { validateCreateOrder, validateUpdateOrder } from '../validation/orderValidators';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validateRequest(validateCreateOrder), createOrder);
router.patch('/:id', validateRequest(validateUpdateOrder), updateOrder);

export default router;

