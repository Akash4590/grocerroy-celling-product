const Product = require('./models/Product');

const sampleProducts = [
  { name: 'Organic Bananas', description: 'Fresh organic bananas, perfect for smoothies and snacking. Naturally sweetened and rich in potassium.', price: 1.49, originalPrice: 1.99, category: 'Fruits', image: '🍌', stock: 150, unit: 'bunch', rating: 4.7, reviewCount: 234, badge: 'Organic', isOrganic: true, isFeatured: true },
  { name: 'Fresh Strawberries', description: 'Sweet and juicy strawberries freshly picked from local farms. Packed with antioxidants.', price: 3.99, originalPrice: 4.99, category: 'Fruits', image: '🍓', stock: 80, unit: 'pack', rating: 4.9, reviewCount: 412, badge: 'Popular', isFeatured: true },
  { name: 'Hass Avocado', description: 'Perfectly ripe Hass avocados, great for guacamole, salads, and toast. Creamy texture.', price: 2.29, category: 'Fruits', image: '🥑', stock: 60, unit: 'each', rating: 4.6, reviewCount: 178 },
  { name: 'Red Apples', description: 'Crisp and sweet red apples, perfect for fresh eating and baking. Locally sourced.', price: 1.99, category: 'Fruits', image: '🍎', stock: 200, unit: 'lb', rating: 4.5, reviewCount: 321 },
  { name: 'Mango', description: 'Tropical Alphonso mangoes bursting with sweetness. A vitamin C powerhouse.', price: 2.79, originalPrice: 3.49, category: 'Fruits', image: '🥭', stock: 70, unit: 'each', rating: 4.8, reviewCount: 267, badge: 'Sale' },
  { name: 'Fresh Broccoli', description: 'Nutrient-rich broccoli crowns, ideal for stir-fry, steaming, and roasting.', price: 2.49, category: 'Vegetables', image: '🥦', stock: 90, unit: 'head', rating: 4.4, reviewCount: 145, badge: 'Healthy', isFeatured: true },
  { name: 'Baby Spinach', description: 'Tender baby spinach leaves, perfect for salads, smoothies, and sautéing.', price: 3.49, category: 'Vegetables', image: '🥬', stock: 70, unit: 'bag', rating: 4.8, reviewCount: 198, badge: 'Organic', isOrganic: true },
  { name: 'Sweet Carrots', description: 'Crunchy and naturally sweet carrots. Great for snacking, juicing, and cooking.', price: 1.79, category: 'Vegetables', image: '🥕', stock: 150, unit: 'lb', rating: 4.3, reviewCount: 112 },
  { name: 'Cherry Tomatoes', description: 'Vibrant cherry tomatoes bursting with flavor. Perfect for salads and pasta.', price: 2.99, category: 'Vegetables', image: '🍅', stock: 110, unit: 'pint', rating: 4.6, reviewCount: 203 },
  { name: 'Whole Milk', description: 'Farm-fresh whole milk, creamy and nutritious. From free-range grass-fed cows.', price: 4.29, category: 'Dairy', image: '🥛', stock: 55, unit: 'gallon', rating: 4.7, reviewCount: 389, badge: 'Fresh', isFeatured: true },
  { name: 'Greek Yogurt', description: 'Thick and creamy Greek yogurt, high in protein. Perfect for breakfast or snacking.', price: 5.99, category: 'Dairy', image: '🫙', stock: 80, unit: 'tub', rating: 4.8, reviewCount: 457, badge: 'Popular' },
  { name: 'Cheddar Cheese', description: 'Aged sharp cheddar cheese with rich, bold flavor. Perfect for sandwiches and cooking.', price: 6.49, category: 'Dairy', image: '🧀', stock: 45, unit: 'block', rating: 4.5, reviewCount: 234 },
  { name: 'Free-Range Eggs', description: 'Fresh free-range eggs from pasture-raised hens. Naturally nutritious and flavorful.', price: 5.49, category: 'Dairy', image: '🥚', stock: 100, unit: 'dozen', rating: 4.9, reviewCount: 521, badge: 'Organic', isOrganic: true, isFeatured: true },
  { name: 'Sourdough Bread', description: 'Artisan sourdough bread with a perfect crust and chewy interior. Baked fresh daily.', price: 4.99, category: 'Bakery', image: '🍞', stock: 30, unit: 'loaf', rating: 4.8, reviewCount: 312, badge: 'Artisan', isFeatured: true },
  { name: 'Butter Croissants', description: 'Buttery, flaky croissants baked fresh every morning. A French bakery classic.', price: 3.79, category: 'Bakery', image: '🥐', stock: 40, unit: 'pack of 4', rating: 4.7, reviewCount: 287 },
  { name: 'Chicken Breast', description: 'Boneless, skinless chicken breast. Hormone-free and antibiotic-free. Versatile and lean.', price: 8.99, category: 'Meat', image: '🍗', stock: 65, unit: 'lb', rating: 4.6, reviewCount: 445 },
  { name: 'Atlantic Salmon', description: 'Premium Atlantic salmon fillet, rich in omega-3 fatty acids. Wild-caught and sustainable.', price: 12.99, category: 'Seafood', image: '🐟', stock: 35, unit: 'fillet', rating: 4.9, reviewCount: 267, badge: 'Premium', isFeatured: true },
  { name: 'Extra Virgin Olive Oil', description: 'Cold-pressed extra virgin olive oil imported from Italy. Rich in healthy fats.', price: 9.99, category: 'Pantry', image: '🫒', stock: 75, unit: 'bottle', rating: 4.8, reviewCount: 341, badge: 'Imported' },
  { name: 'Pure Orange Juice', description: '100% pure squeezed orange juice. No added sugar, preservatives, or artificial flavors.', price: 4.49, category: 'Beverages', image: '🍊', stock: 60, unit: 'carton', rating: 4.6, reviewCount: 198, badge: 'Fresh', isFeatured: true },
  { name: 'Japanese Green Tea', description: 'Premium Japanese matcha green tea bags. Packed with antioxidants and natural calm.', price: 3.99, category: 'Beverages', image: '🍵', stock: 100, unit: 'box', rating: 4.7, reviewCount: 156, badge: 'Healthy', isOrganic: true },
];

async function seedDatabase() {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${inserted.length} products successfully`);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

module.exports = seedDatabase;
