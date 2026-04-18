const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const getSessionId = (req) => req.headers['x-session-id'] || 'default-session';

// POST /api/orders — place order
router.post('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { name, email, phone, address, city, zipCode, notes, paymentMethod } = req.body;

    if (!name || !email || !address || !city || !zipCode) {
      return res.status(400).json({ success: false, error: 'Name, email, address, city and zip are required' });
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const subtotal = parseFloat(cart.items.reduce((s, i) => s + i.subtotal, 0).toFixed(2));
    const deliveryFee = subtotal >= 35 ? 0 : 4.99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));
    const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000);

    const order = await Order.create({
      sessionId,
      items: cart.items,
      subtotal,
      deliveryFee,
      tax,
      total,
      customer: { name, email, phone: phone || '', address, city, zipCode, notes: notes || '' },
      paymentMethod: paymentMethod || 'cash',
      status: 'confirmed',
      estimatedDelivery,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders — session orders
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const orders = await Order.find({ sessionId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
