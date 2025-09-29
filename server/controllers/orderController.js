import stripe from 'stripe';
import Order from '../models/Order.js';

const createCheckoutSession = async (req, res) => {
  const { cartItems, email } = req.body;

  const orderItems = cartItems.map((item) => ({
    name: item.title,
    qty: item.qty,
    image: item.thumbnail,
    price: item.price,
    product: item.id,
  }));

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const order = new Order({
    user: req.user._id,
    orderItems,
    totalPrice,
    isPaid: false,
  });
  const createdOrder = await order.save();

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'No cart items provided' });
  }

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: 'usd', 
      product_data: {
        name: item.title,
        images: [item.thumbnail],
        description: item.description,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email: email,
      metadata: {
        orderId: createdOrder._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-failed`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Failed to create Stripe session' });
  }
};

const stripeWebhook = async (req, res) => {
  const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: session.payment_intent,
        status: session.payment_status,
        update_time: new Date().toISOString(),
        email_address: session.customer_details.email,
      };
      await order.save();
    }
  }

  res.status(200).json({ received: true });
};

// @desc    Get order by Stripe session ID
// @route   GET /api/orders/session/:sessionId
// @access  Private
const getOrderBySessionId = async (req, res) => {
  const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const session = await stripeClient.checkout.sessions.retrieve(req.params.sessionId);
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (order && order.user._id.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve order' });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
};

export { createCheckoutSession, stripeWebhook, getMyOrders, getOrderBySessionId };