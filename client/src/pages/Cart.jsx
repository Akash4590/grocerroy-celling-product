import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, itemCount, updateItem, removeItem, emptyCart, syncing } = useCart()
  const navigate = useNavigate()

  const deliveryFee = total >= 35 ? 0 : 4.99
  const tax = parseFloat((total * 0.08).toFixed(2))
  const orderTotal = parseFloat((total + deliveryFee + tax).toFixed(2))

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add some fresh groceries to get started!</p>
          <Link to="/">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary">
              Browse Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Your Cart</h1>
            <p className="text-slate-500 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost">
                ← Continue Shopping
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={emptyCart}
              className="text-red-400 text-sm hover:text-red-300 font-medium transition-colors"
            >
              Clear All
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                >
                  {/* Emoji */}
                  <div className="w-16 h-16 bg-dark-700 rounded-xl flex items-center justify-center text-4xl shrink-0">
                    {item.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">${item.price.toFixed(2)} / {item.unit}</p>
                    <p className="text-sm font-bold text-brand-400 mt-1">${item.subtotal.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 glass rounded-xl px-1 py-1">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateItem(item.product, item.quantity - 1)}
                        disabled={syncing}
                        className="w-8 h-8 rounded-lg bg-dark-600 text-white flex items-center justify-center hover:bg-brand-500/20 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                        </svg>
                      </motion.button>
                      <motion.span key={item.quantity} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-6 text-center font-bold text-white">
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateItem(item.product, item.quantity + 1)}
                        disabled={syncing}
                        className="w-8 h-8 rounded-lg bg-dark-600 text-white flex items-center justify-center hover:bg-brand-500/20 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                          <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                        </svg>
                      </motion.button>
                    </div>

                    {/* Remove */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.product, item.name)}
                      className="w-8 h-8 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" strokeWidth="2"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeWidth="2"/>
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 h-fit sticky top-24"
          >
            <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-white font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-brand-400 font-medium' : 'text-white font-medium'}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span className="text-white font-medium">${tax.toFixed(2)}</span>
              </div>

              {total < 35 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400"
                >
                  Add ${(35 - total).toFixed(2)} more for free delivery! 🚚
                </motion.div>
              )}

              <div className="border-t border-dark-500 pt-3 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="gradient-text">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>

            <Link to="/">
              <motion.button whileHover={{ scale: 1.01 }} className="btn-ghost w-full mt-3 text-center text-sm">
                ← Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
