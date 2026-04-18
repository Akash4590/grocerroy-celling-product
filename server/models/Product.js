const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Pantry', 'Snacks'] },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 100, min: 0 },
  unit: { type: String, required: true, default: 'each' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  isOrganic: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
