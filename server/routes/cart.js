const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getSessionId = (req) => req.headers['x-session-id'] || 'default-session';

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    let cart = await Cart.findOne({ sessionId });
    if (!cart) cart = new Cart({ sessionId, items: [] });
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cart/add
router.post('/add', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    if (quantity > product.stock) return res.status(400).json({ success: false, error: 'Insufficient stock' });

    let cart = await Cart.findOne({ sessionId });
    if (!cart) cart = new Cart({ sessionId, items: [] });

    const existingIdx = cart.items.findIndex(i => i.product.toString() === productId);
    if (existingIdx > -1) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ success: false, error: 'Exceeds available stock' });
      cart.items[existingIdx].quantity = newQty;
      cart.items[existingIdx].subtotal = parseFloat((product.price * newQty).toFixed(2));
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        unit: product.unit,
        quantity,
        subtotal: parseFloat((product.price * quantity).toFixed(2)),
      });
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/cart/update
router.put('/update', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    if (quantity === 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      const item = cart.items.find(i => i.product.toString() === productId);
      if (!item) return res.status(404).json({ success: false, error: 'Item not in cart' });
      item.quantity = quantity;
      item.subtotal = parseFloat((item.price * quantity).toFixed(2));
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    let cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    let cart = await Cart.findOne({ sessionId });
    if (cart) { cart.items = []; await cart.save(); }
    res.json({ success: true, data: cart || { sessionId, items: [], total: 0, itemCount: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
