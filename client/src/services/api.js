import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach session ID to every request
API.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('freshcart-session')
  if (!sessionId) {
    sessionId = 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('freshcart-session', sessionId)
  }
  config.headers['x-session-id'] = sessionId
  return config
})

// ── Products ────────────────────────────────────────────────
export const getProducts = (params = {}) => API.get('/products', { params })
export const getCategories = () => API.get('/products/categories')
export const getProduct = (id) => API.get(`/products/${id}`)

// ── Cart ────────────────────────────────────────────────────
export const getCart = () => API.get('/cart')
export const addToCart = (productId, quantity = 1) => API.post('/cart/add', { productId, quantity })
export const updateCartItem = (productId, quantity) => API.put('/cart/update', { productId, quantity })
export const removeFromCart = (productId) => API.delete(`/cart/remove/${productId}`)
export const clearCart = () => API.delete('/cart/clear')

// ── Orders ──────────────────────────────────────────────────
export const placeOrder = (orderData) => API.post('/orders', orderData)
export const getOrders = () => API.get('/orders')
export const getOrder = (id) => API.get(`/orders/${id}`)

export default API
