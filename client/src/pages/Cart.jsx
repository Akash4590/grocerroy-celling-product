import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

/* ─── Typography helpers ──────────────────────────────────────── */
const sora  = (w=700, sz, tr='-0.03em', lh=1.15) => ({ fontFamily:"'Sora',system-ui,sans-serif",  fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })
const inter = (w=400, sz, tr='0.005em',  lh=1.6)  => ({ fontFamily:"'Inter',system-ui,sans-serif", fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })

export default function Cart() {
  const { items, total, itemCount, updateItem, removeItem, emptyCart, syncing } = useCart()
  const navigate = useNavigate()

  const deliveryFee = total >= 35 ? 0 : 4.99
  const tax         = parseFloat((total * 0.08).toFixed(2))
  const orderTotal  = parseFloat((total + deliveryFee + tax).toFixed(2))

  /* ── Empty state ─────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y:[0,-12,0] }}
            transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>

          {/* Sora 800 heading */}
          <h2 style={{ ...sora(800,'2rem','-0.04em',1.1), color:'#f1f5f9', marginBottom:'0.75rem' }}>
            Your cart is empty
          </h2>

          {/* Inter 400 sub */}
          <p style={{ ...inter(400,'1.0625rem','0.005em',1.75), color:'#64748b', marginBottom:'2rem' }}>
            Add some fresh groceries to get started!
          </p>

          <Link to="/">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} className="btn-primary">
              Browse Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  /* ── Main cart view ──────────────────────────────────────── */
  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background:'#05050a' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ───────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          className="flex items-start justify-between mb-10"
        >
          <div>
            {/* Overline */}
            <span style={{ ...inter(700,'0.7rem','0.2em',1), color:'#22c55e', textTransform:'uppercase' }}>
              Your Order
            </span>
            {/* Sora 800 page title */}
            <h1 style={{ ...sora(800,'clamp(1.9rem,4vw,2.6rem)','-0.045em',1.05), color:'#f8fafc', marginTop:'8px' }}>
              Shopping Cart
            </h1>
            {/* Inter 400 item count */}
            <p style={{ ...inter(400,'0.9375rem','0.008em',1.5), color:'#475569', marginTop:'6px' }}>
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your bag
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <Link to="/">
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} className="btn-ghost">
                ← Continue Shopping
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={emptyCart}
              style={{ ...inter(500,'0.875rem','0.01em',1), color:'#f87171', transition:'color 0.2s', background:'none', border:'none', cursor:'pointer' }}
              onMouseEnter={e => e.target.style.color='#fca5a5'}
              onMouseLeave={e => e.target.style.color='#f87171'}
              id="clear-cart-btn"
            >
              Clear All
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Cart Items ────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product}
                  layout
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:20, height:0 }}
                  transition={{ duration:0.3 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4 group"
                  style={{ border:'1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Emoji thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl shrink-0"
                    style={{ background:'rgba(20,20,38,0.8)' }}
                  >
                    {item.image}
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    {/* Product name — Sora 700 */}
                    <h3 className="truncate" style={{ ...sora(700,'0.9875rem','-0.02em',1.3), color:'#f1f5f9' }}>
                      {item.name}
                    </h3>
                    {/* Price/unit — Inter 400 */}
                    <p style={{ ...inter(400,'0.825rem','0.008em',1.4), color:'#475569', marginTop:'3px' }}>
                      ${item.price.toFixed(2)} / {item.unit}
                    </p>
                    {/* Subtotal — Inter 600, green */}
                    <p style={{ ...inter(600,'0.9rem','0.005em',1.3), color:'#4ade80', marginTop:'4px' }}>
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>

                  {/* Qty controls + remove */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 glass rounded-xl px-1 py-1">
                      <motion.button
                        whileTap={{ scale:0.85 }}
                        onClick={() => updateItem(item.product, item.quantity - 1)}
                        disabled={syncing}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        style={{ background:'rgba(30,30,52,0.8)' }}
                      >
                        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                        </svg>
                      </motion.button>

                      {/* Quantity — Sora 700 */}
                      <motion.span
                        key={item.quantity}
                        initial={{ scale:1.4 }} animate={{ scale:1 }}
                        style={{ ...sora(700,'0.95rem','-0.02em',1), color:'#f1f5f9', width:'1.5rem', textAlign:'center', display:'inline-block' }}
                      >
                        {item.quantity}
                      </motion.span>

                      <motion.button
                        whileTap={{ scale:0.85 }}
                        onClick={() => updateItem(item.product, item.quantity + 1)}
                        disabled={syncing}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        style={{ background:'rgba(30,30,52,0.8)' }}
                      >
                        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                          <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                        </svg>
                      </motion.button>
                    </div>

                    {/* Delete button */}
                    <motion.button
                      whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                      onClick={() => removeItem(item.product, item.name)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ color:'#475569' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(248,113,113,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.color='#475569'; e.currentTarget.style.background='transparent' }}
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

          {/* ── Order Summary ─────────────────────────────── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            className="glass-card rounded-2xl p-6 h-fit sticky top-24"
          >
            {/* Summary heading — Sora 700 */}
            <h2 style={{ ...sora(700,'1.15rem','-0.03em',1.2), color:'#f1f5f9', marginBottom:'1.25rem' }}>
              Order Summary
            </h2>

            <div className="flex flex-col gap-3">
              {/* Line items — Inter 400/500 */}
              {[
                ['Subtotal', `(${itemCount} items)`, `$${total.toFixed(2)}`, '#94a3b8'],
                ['Delivery Fee', '', deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`, deliveryFee === 0 ? '#4ade80' : '#94a3b8'],
                ['Tax', '(8%)', `$${tax.toFixed(2)}`, '#94a3b8'],
              ].map(([label, sub, val, valColor]) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span style={{ ...inter(400,'0.9rem','0.006em',1.4), color:'#64748b' }}>
                    {label} {sub && <span style={{ ...inter(400,'0.8rem'), color:'#475569' }}>{sub}</span>}
                  </span>
                  <span style={{ ...inter(600,'0.9rem','0.005em',1.4), color: valColor }}>
                    {val}
                  </span>
                </div>
              ))}

              {/* Free delivery nudge */}
              {total < 35 && (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="rounded-xl p-3"
                  style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.18)' }}
                >
                  <p style={{ ...inter(500,'0.8rem','0.01em',1.5), color:'#fbbf24' }}>
                    Add ${(35 - total).toFixed(2)} more for free delivery! 🚚
                  </p>
                </motion.div>
              )}

              {/* Total row — Sora 700 */}
              <div className="flex justify-between items-center pt-4"
                style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:'4px' }}>
                <span style={{ ...sora(700,'1.05rem','-0.025em',1), color:'#f1f5f9' }}>Total</span>
                <span className="gradient-text" style={{ ...sora(800,'1.35rem','-0.04em',1) }}>
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <motion.button
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={() => navigate('/checkout')}
              className="btn-glow w-full mt-6"
              id="checkout-btn"
            >
              Proceed to Checkout →
            </motion.button>

            <Link to="/">
              <motion.button
                whileHover={{ scale:1.01 }}
                className="btn-ghost w-full mt-3 text-center"
                style={{ ...inter(500,'0.875rem','0.01em',1), justifyContent:'center' }}
              >
                ← Continue Shopping
              </motion.button>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
