const { v4: uuidv4 } = require("uuid");

// In-memory order storage
const orders = [];

class Order {
  constructor(cart, customerInfo) {
    this.id = "ORD-" + uuidv4().slice(0, 8).toUpperCase();
    this.sessionId = cart.sessionId;
    this.items = [...cart.items];
    this.itemCount = cart.getItemCount();
    this.subtotal = cart.getTotal();
    this.deliveryFee = this.subtotal >= 35 ? 0 : 4.99;
    this.tax = parseFloat((this.subtotal * 0.08).toFixed(2));
    this.total = parseFloat(
      (this.subtotal + this.deliveryFee + this.tax).toFixed(2)
    );
    this.customer = {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || "",
      address: customerInfo.address,
      city: customerInfo.city,
      zipCode: customerInfo.zipCode,
      notes: customerInfo.notes || "",
    };
    this.status = "confirmed";
    this.paymentMethod = customerInfo.paymentMethod || "cash";
    this.createdAt = new Date().toISOString();
    this.estimatedDelivery = this._calculateDeliveryTime();
  }

  _calculateDeliveryTime() {
    const delivery = new Date();
    delivery.setMinutes(delivery.getMinutes() + 45);
    return delivery.toISOString();
  }

  static create(cart, customerInfo) {
    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cannot place order with empty cart");
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      throw new Error("Name, email, and address are required");
    }

    const order = new Order(cart, customerInfo);
    orders.push(order);

    // Clear the cart after order is placed
    cart.clear();

    return order;
  }

  static getById(orderId) {
    return orders.find((o) => o.id === orderId) || null;
  }

  static getBySession(sessionId) {
    return orders.filter((o) => o.sessionId === sessionId);
  }

  static getAll() {
    return orders;
  }

  toJSON() {
    return {
      id: this.id,
      items: this.items,
      itemCount: this.itemCount,
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee,
      tax: this.tax,
      total: this.total,
      customer: this.customer,
      status: this.status,
      paymentMethod: this.paymentMethod,
      createdAt: this.createdAt,
      estimatedDelivery: this.estimatedDelivery,
    };
  }
}

module.exports = Order;
