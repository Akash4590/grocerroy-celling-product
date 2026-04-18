import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, total, itemCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', zipCode: '',
    notes: '', paymentMethod: 'cash',
  })

  const deliveryFee = total >= 35 ? 0 : 4.99
  const tax = parseFloat((total * 0.08).toFixed(2))
  const orderTotal = parseFloat((total + deliveryFee + tax).toFixed(2))

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return toast.error('Your cart is empty')

    setLoading(true)
    try {
      const { data } = await placeOrder(form)
      if (data.success) {
        setOrderSuccess(data.data)
        await fetchCart()
        toast.success('Order placed successfully! 🎉')
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  // Success State
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass rounded-3xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2">Order Confirmed!</h2>
          <p className="text-slate-400 mb-6">Thank you for shopping with FreshCart</p>

          <div className="glass rounded-2xl p-4 text-left text-sm flex flex-col gap-3 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number</span>
              <span className="text-brand-400 font-bold">{orderSuccess.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid</span>
              <span className="text-white font-bold">${orderSuccess.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="text-brand-400 capitalize font-medium">{orderSuccess.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery In</span>
              <span className="text-white font-medium">~45 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="text-white capitalize font-medium">
                {orderSuccess.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Credit Card'}
              </span>
            </div>
          </div>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full"
            >
              Continue Shopping 🛒
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">No items to checkout</h2>
        <Link to="/"><button className="btn-primary mt-4">Browse Products</button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-slate-500 mt-1">{itemCount} items · ${orderTotal.toFixed(2)} total</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-6">
            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lg">👤</span> Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lg">📍</span> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">Street Address *</label>
                  <input name="address" value={form.address} onChange={handleChange} required placeholder="123 Main Street, Apt 4B" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="New York" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block">Zip Code *</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="10001" className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lg">💳</span> Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'card', label: 'Credit Card', icon: '💳' },
                ].map((opt) => (
                  <motion.label
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === opt.value
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-dark-500 hover:border-dark-400'
                    }`}
                  >
                    <input type="radio" name="paymentMethod" value={opt.value} checked={form.paymentMethod === opt.value} onChange={handleChange} className="sr-only" />
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`text-sm font-medium ${form.paymentMethod === opt.value ? 'text-brand-400' : 'text-slate-300'}`}>{opt.label}</span>
                    {form.paymentMethod === opt.value && <span className="ml-auto text-brand-400">✓</span>}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lg">📝</span> Delivery Notes
              </h2>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any special delivery instructions..." className="input-field resize-none" />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
              ) : (
                <>🛍️ Place Order · ${orderTotal.toFixed(2)}</>
              )}
            </motion.button>
          </form>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-bold text-white mb-5">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-2xl shrink-0">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dark-500 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-white">${total.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-brand-400' : 'text-white'}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-400"><span>Tax (8%)</span><span className="text-white">${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-500">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
