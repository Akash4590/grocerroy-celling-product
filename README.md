# 🛒 Grocery Selling App (Full Stack MERN Project)

A modern full-stack grocery e-commerce web application built using **MERN Stack (MongoDB, Express, React, Node.js)**.  
This project demonstrates real-world e-commerce functionality including product listing, cart system, and backend API integration.

---
# 🚀 Live Project Features

# 🛍️ Product System
- Display all products from database
- Product categories filtering
- Product details view

## 🛒 Cart System
- Add products to cart
- Update quantity
- Remove items from cart
- Clear cart functionality

## 📦 Order System
- Place orders from cart
- View order history
- Order details management

## ⚡ Performance
- Fast frontend using React + Vite
- REST API backend with Express
- MongoDB database integration

---

# 🛠️ Tech Stack

## 🎨 Frontend
- React.js
- Vite
- JavaScript
- CSS / Tailwind (if used)

## ⚙️ Backend
- Node.js
- Express.js
- MongoDB (:contentReference[oaicite:0]{index=0})

---

# 📁 Project Structure
Grocerroy Selling Product/
├── client # React Frontend
├── server # Node + Express Backend

---

# 🚀 How to Run Project

## 📌 Step 1: Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd server
npm install
npm run dev
👉 Backend  will run on:
http://localhost:5000
📌 Step 3: Run Frontend
cd client
npm install
npm run dev
👉 Frontend will run on:
http://localhost:5173
🔗 API Endpoints
🛍️ Products
GET /api/products
GET /api/products/categories
GET /api/products/:id
🛒 Cart
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove/:id
DELETE /api/cart/clear
📦 Orders
POST /api/orders
GET /api/orders
GET /api/orders/:id
🔐 Environment Variables

Create .env file inside server folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000
⚠️ Important Notes
MongoDB must be running before starting backend
Always start backend first, then frontend
Use correct API base URL in frontend
Do not close backend terminal while using app

👨‍💻 Developer
Name: Akash khan
GitHub: https://github.com/your-username
Project: Grocery E-commerce App
