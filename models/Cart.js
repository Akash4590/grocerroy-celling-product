const Product = require("./Product");

// In-memory cart storage (keyed by session ID)
const carts = new Map();

class Cart {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.items = [];
    this.updatedAt = new Date().toISOString();
  }

  static getOrCreate(sessionId) {
    if (!carts.has(sessionId)) {
      carts.set(sessionId, new Cart(sessionId));
    }
    return carts.get(sessionId);
  }

  addItem(productId, quantity = 1) {
    const product = Product.getById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    if (quantity > product.stock) {
      throw new Error("Insufficient stock");
    }

    const existingItem = this.items.find((item) => item.productId === productId);
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        throw new Error("Insufficient stock for requested quantity");
      }
      existingItem.quantity = newQty;
      existingItem.subtotal = parseFloat((product.price * newQty).toFixed(2));
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: quantity,
        subtotal: parseFloat((product.price * quantity).toFixed(2)),
      });
    }

    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateItemQuantity(productId, quantity) {
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    if (quantity === 0) {
      return this.removeItem(productId);
    }

    const product = Product.getById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (quantity > product.stock) {
      throw new Error("Insufficient stock");
    }

    const item = this.items.find((item) => item.productId === productId);
    if (!item) {
      throw new Error("Item not in cart");
    }

    item.quantity = quantity;
    item.subtotal = parseFloat((product.price * quantity).toFixed(2));
    this.updatedAt = new Date().toISOString();
    return this;
  }

  removeItem(productId) {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index === -1) {
      throw new Error("Item not in cart");
    }
    this.items.splice(index, 1);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  clear() {
    this.items = [];
    this.updatedAt = new Date().toISOString();
    return this;
  }

  getTotal() {
    return parseFloat(
      this.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
    );
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      items: this.items,
      itemCount: this.getItemCount(),
      total: this.getTotal(),
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Cart;
