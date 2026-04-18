const productsData = require("../data/products");

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.unit = data.unit;
    this.image = data.image;
    this.description = data.description;
    this.stock = data.stock;
    this.rating = data.rating;
    this.badge = data.badge || "";
  }

  static getAll() {
    return productsData.map((p) => new Product(p));
  }

  static getById(id) {
    const data = productsData.find((p) => p.id === id);
    return data ? new Product(data) : null;
  }

  static getByCategory(category) {
    return productsData
      .filter((p) => p.category.toLowerCase() === category.toLowerCase())
      .map((p) => new Product(p));
  }

  static getCategories() {
    return [...new Set(productsData.map((p) => p.category))];
  }

  static search(query) {
    const q = query.toLowerCase();
    return productsData
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .map((p) => new Product(p));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      unit: this.unit,
      image: this.image,
      description: this.description,
      stock: this.stock,
      rating: this.rating,
      badge: this.badge,
    };
  }
}

module.exports = Product;
