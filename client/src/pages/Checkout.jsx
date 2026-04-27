import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/api'
import toast from 'react-hot-toast'

/* ─── Typography helpers ──────────────────────────────────────── */
const sora  = (w=700, sz, tr='-0.03em', lh=1.15) => ({ fontFamily:"'Sora',system-ui,sans-serif",  fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })
const inter = (w=400, sz, tr='0.005em',  lh=1.6)  => ({ fontFamily:"'Inter',system-ui,sans-serif", fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })

/* Reusable label component */
function Label({ children, required }) {
  return (
    <label
      className="block mb-1.5"
      style={{ ...inter(600,'0.78rem','0.04em',1), color:'#64748b', textTransform:'uppercase' }}
    >
      {children}{required && <span style={{ color:'#f87171', marginLeft:'3px' }}>*</span>}
    </label>
  )
}

export default function Checkout() {
  const { items, total, itemCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading]         = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const [form, setForm] = useState({
    name:'', email:'', phone:'', address:'', city:'', zipCode:'',
    notes:'', paymentMethod:'cash',
  })

  const deliveryFee = total >= 35 ? 0 : 4.99
  const tax         = parseFloat((total * 0.08).toFixed(2))
  const orderTotal  = parseFloat((total + deliveryFee + tax).toFixed(2))

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

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

  /* ── Order success screen ────────────────────────────────── */
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16" style={{ background:'#05050a' }}>
        <motion.div
          initial={{ opacity:0, scale:0.85 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ type:'spring', stiffness:200, damping:20 }}
          className="glass-card rounded-3xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale:0 }} animate={{ scale:[0,1.3,1] }}
            transition={{ delay:0.2, duration:0.6, ease:'easeOut' }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>

          {/* Sora 800 — success headline */}
          <h2 style={{ ...sora(800,'2rem','-0.04em',1.1), color:'#f8fafc', marginBottom:'8px' }}>
            Order Confirmed!
          </h2>
          <p style={{ ...inter(400,'1.0625rem','0.005em',1.75), color:'#64748b', marginBottom:'1.75rem' }}>
            Thank you for shopping with FreshCart
          </p>

          {/* Order detail block */}
          <div className="glass rounded-2xl p-5 text-left flex flex-col gap-3 mb-6">
            {[
              ['Order Number', orderSuccess.orderNumber, '#4ade80'],
              ['Total Paid',   `$${orderSuccess.total?.toFixed(2)}`, '#f8fafc'],
              ['Status',       orderSuccess.status,     '#4ade80'],
              ['Delivery In',  '~45 minutes',           '#f8fafc'],
              ['Payment',      orderSuccess.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Credit Card', '#f8fafc'],
            ].map(([label, val, valColor]) => (
              <div key={label} className="flex justify-between items-center">
                <span style={{ ...inter(400,'0.875rem','0.006em',1.4), color:'#475569' }}>{label}</span>
                <span style={{ ...inter(600,'0.875rem','0.005em',1.4), color: valColor, textTransform:'capitalize' }}>{val}</span>
              </div>
            ))}
          </div>

          <Link to="/">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} className="btn-primary w-full">
              Continue Shopping 🛒
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  /* ── Empty checkout guard ────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4" style={{ background:'#05050a' }}>
        <div className="text-6xl mb-4">🛒</div>
        <h2 style={{ ...sora(700,'1.5rem','-0.035em',1.2), color:'#f1f5f9', marginBottom:'8px' }}>
          No items to checkout
        </h2>
        <Link to="/"><button className="btn-primary mt-4">Browse Products</button></Link>
      </div>
    )
  }

  /* ── Main checkout ───────────────────────────────────────── */
  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background:'#05050a' }}>
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="mb-10">
          <span style={{ ...inter(700,'0.7rem','0.2em',1), color:'#22c55e', textTransform:'uppercase' }}>
            Final Step
          </span>
          <h1 style={{ ...sora(800,'clamp(1.9rem,4vw,2.6rem)','-0.045em',1.05), color:'#f8fafc', marginTop:'8px' }}>
            Checkout
          </h1>
          <p style={{ ...inter(400,'0.9375rem','0.008em',1.5), color:'#475569', marginTop:'6px' }}>
            {itemCount} items · ${orderTotal.toFixed(2)} total
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Form ──────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-6">

            {/* Personal Info */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              className="glass-card rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 mb-5"
                style={{ ...sora(700,'1.05rem','-0.03em',1.2), color:'#f1f5f9' }}>
                <span>👤</span> Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Full Name</Label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <Label required>Email</Label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="john@example.com" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Phone</Label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000" className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="glass-card rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 mb-5"
                style={{ ...sora(700,'1.05rem','-0.03em',1.2), color:'#f1f5f9' }}>
                <span>📍</span> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label required>Street Address</Label>
                  <input name="address" value={form.address} onChange={handleChange} required
                    placeholder="123 Main Street, Apt 4B" className="input-field" />
                </div>
                <div>
                  <Label required>City</Label>
                  <input name="city" value={form.city} onChange={handleChange} required
                    placeholder="New York" className="input-field" />
                </div>
                <div>
                  <Label required>Zip Code</Label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} required
                    placeholder="10001" className="input-field" />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              className="glass-card rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 mb-5"
                style={{ ...sora(700,'1.05rem','-0.03em',1.2), color:'#f1f5f9' }}>
                <span>💳</span> Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value:'cash', label:'Cash on Delivery', icon:'💵' },
                  { value:'card', label:'Credit Card',      icon:'💳' },
                ].map(opt => (
                  <motion.label key={opt.value} whileHover={{ scale:1.02 }}
                    className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      border: form.paymentMethod === opt.value
                        ? '1.5px solid rgba(34,197,94,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                      background: form.paymentMethod === opt.value
                        ? 'rgba(34,197,94,0.07)' : 'transparent',
                    }}
                  >
                    <input type="radio" name="paymentMethod" value={opt.value}
                      checked={form.paymentMethod === opt.value} onChange={handleChange} className="sr-only" />
                    <span className="text-2xl">{opt.icon}</span>
                    {/* Payment label — Inter 600 */}
                    <span style={{
                      ...inter(600,'0.9rem','0.01em',1.3),
                      color: form.paymentMethod === opt.value ? '#4ade80' : '#94a3b8',
                    }}>
                      {opt.label}
                    </span>
                    {form.paymentMethod === opt.value && (
                      <span className="ml-auto text-emerald-400">✓</span>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="glass-card rounded-2xl p-6">
              <h2 className="flex items-center gap-2.5 mb-5"
                style={{ ...sora(700,'1.05rem','-0.03em',1.2), color:'#f1f5f9' }}>
                <span>📝</span> Delivery Notes
              </h2>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                placeholder="Any special delivery instructions..."
                className="input-field resize-none"
                style={{ ...inter(400,'0.9375rem','0.008em',1.65) }}
              />
            </motion.div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              type="submit" disabled={loading}
              className="btn-glow w-full"
              style={{ fontSize:'1rem', padding:'1rem 2rem' }}
              id="place-order-btn"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span style={inter(600,'1rem','0.02em',1)}>Placing Order…</span>
                </>
              ) : (
                <span style={inter(700,'1rem','0.02em',1)}>
                  🛍️&nbsp; Place Order · ${orderTotal.toFixed(2)}
                </span>
              )}
            </motion.button>
          </form>

          {/* ── Order Summary Sidebar ─────────────────────── */}
          <motion.div
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              {/* Heading — Sora 700 */}
              <h2 style={{ ...sora(700,'1.1rem','-0.025em',1.2), color:'#f1f5f9', marginBottom:'1.25rem' }}>
                Order Summary
              </h2>

              {/* Item list */}
              <div className="flex flex-col gap-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl shrink-0"
                      style={{ background:'rgba(20,20,38,0.8)' }}>
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Item name — Sora 600 */}
                      <p className="truncate" style={{ ...sora(600,'0.875rem','-0.02em',1.3), color:'#e2e8f0' }}>
                        {item.name}
                      </p>
                      {/* Quantity — Inter 400 */}
                      <p style={{ ...inter(400,'0.775rem','0.01em',1.3), color:'#475569' }}>
                        ×{item.quantity}
                      </p>
                    </div>
                    {/* Subtotal — Sora 600 */}
                    <span style={{ ...sora(600,'0.875rem','-0.02em',1), color:'#f1f5f9', flexShrink:0 }}>
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2.5 pt-4"
                style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                {[
                  ['Subtotal',    `$${total.toFixed(2)}`,     '#94a3b8'],
                  ['Delivery',    deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`, deliveryFee === 0 ? '#4ade80' : '#94a3b8'],
                  ['Tax (8%)',    `$${tax.toFixed(2)}`,        '#94a3b8'],
                ].map(([label, val, valColor]) => (
                  <div key={label} className="flex justify-between">
                    <span style={{ ...inter(400,'0.875rem','0.006em',1.4), color:'#475569' }}>{label}</span>
                    <span style={{ ...inter(500,'0.875rem','0.005em',1.4), color: valColor }}>{val}</span>
                  </div>
                ))}

                {/* Grand total — Sora 800 */}
                <div className="flex justify-between items-center pt-3"
                  style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:'4px' }}>
                  <span style={{ ...sora(700,'1.05rem','-0.03em',1), color:'#f1f5f9' }}>Total</span>
                  <span className="gradient-text" style={{ ...sora(800,'1.3rem','-0.04em',1) }}>
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
