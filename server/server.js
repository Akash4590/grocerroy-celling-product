const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freshcart';

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── MongoDB Connection ───────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Auto-seed if DB is empty
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      const seedDatabase = require('./seed');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║   🛒  FreshCart API Server                   ║
║   → http://localhost:${PORT}                   ║
║                                              ║
║   Endpoints:                                 ║
║   GET    /api/products                       ║
║   GET    /api/products/categories            ║
║   GET    /api/products/:id                   ║
║   GET    /api/cart                           ║
║   POST   /api/cart/add                       ║
║   PUT    /api/cart/update                    ║
║   DELETE /api/cart/remove/:id                ║
║   DELETE /api/cart/clear                     ║
║   POST   /api/orders                         ║
║   GET    /api/orders                         ║
║   GET    /api/orders/:id                     ║
╚══════════════════════════════════════════════╝
      `);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
