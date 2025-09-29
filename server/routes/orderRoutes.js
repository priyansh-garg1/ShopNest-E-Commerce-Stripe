import express from 'express';
const router = express.Router();
import {
  createCheckoutSession,
  getMyOrders,
  getOrderBySessionId,
  stripeWebhook,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/create-checkout-session').post(protect, createCheckoutSession);
router.route('/myorders').get(protect, getMyOrders);
router.route('/session/:sessionId').get(protect, getOrderBySessionId);

// Stripe requires the raw body to verify the signature
router.route('/webhook').post(express.raw({ type: 'application/json' }), stripeWebhook);

export default router;