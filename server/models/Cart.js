const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  subtotal: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

cartSchema.virtual('total').get(function () {
  return parseFloat(this.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
});

cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
