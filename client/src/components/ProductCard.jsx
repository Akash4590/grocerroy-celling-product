import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

/* ─── Type helpers ────────────────────────────────────────────── */
const sora  = (w=700, sz, tr='-0.025em', lh=1.2) => ({ fontFamily:"'Sora',system-ui,sans-serif",   fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })
const inter = (w=400, sz, tr='0.005em',  lh=1.6)  => ({ fontFamily:"'Inter',system-ui,sans-serif",  fontWeight:w, letterSpacing:tr, lineHeight:lh, ...(sz?{fontSize:sz}:{}) })

const badgeColors = {
  Organic: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Popular: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  Fresh:   'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Premium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Artisan: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  Healthy: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  Imported:'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  Sale:    'bg-red-500/20 text-red-400 border border-red-500/30',
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem, getQty, updateItem } = useCart()
  const qty = getQty(product._id)

  const handleAdd      = e => { e.stopPropagation(); addItem(product, 1) }
  const handleIncrease = e => { e.stopPropagation(); updateItem(product._id, qty + 1) }
  const handleDecrease = e => { e.stopPropagation(); updateItem(product._id, qty - 1) }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, delay:index*0.05, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-6, transition:{ duration:0.22 } }}
      className="group cursor-pointer flex flex-col overflow-hidden relative"
      id={`product-card-${product._id}`}
      style={{
        borderRadius: '18px',
        background: 'rgba(14,14,26,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.45)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.22s ease',
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

      {/* Hover green glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderRadius:'18px', background:'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.06), transparent 65%)' }}
      />

      {/* ── Image area ─────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center h-48 overflow-hidden"
        style={{ background:'linear-gradient(160deg,rgba(20,20,38,0.92) 0%,rgba(8,8,18,0.96) 100%)' }}
      >
        {/* Radial glow behind emoji on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background:'radial-gradient(circle,rgba(34,197,94,0.13),transparent 70%)' }} />
        </div>

        <motion.div
          className="text-7xl select-none relative z-10"
          whileHover={{ scale:1.18, rotate:[-3,3,-3,0] }}
          transition={{ duration:0.4 }}
        >
          {product.image}
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
          {product.badge && (
            /* Badge text — Inter 700, ultra-small caps */
            <span className={`badge ${badgeColors[product.badge] || 'bg-slate-500/20 text-slate-400'}`}
              style={inter(700,'0.62rem','0.09em',1)}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30"
              style={inter(700,'0.62rem','0.09em',1)}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Low-stock warning — Inter 600 */}
        {product.stock < 20 && (
          <span className="absolute bottom-2 right-3 glass rounded-full px-2 py-0.5 text-amber-400"
            style={inter(600,'0.7rem','0.01em',1.2)}>
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* ── Content area ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Category + Rating row */}
        <div className="flex items-center justify-between">
          {/* Category — Inter 600, uppercase micro-label */}
          <span style={{ ...inter(600,'0.7rem','0.1em',1), color:'#475569', textTransform:'uppercase' }}>
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs">★</span>
            <span style={inter(500,'0.775rem','0.01em',1)}  className="text-slate-400">{product.rating?.toFixed(1)}</span>
            <span style={inter(400,'0.725rem','0.01em',1)}  className="text-slate-600">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product name — Sora 700 — this is the most critical text */}
        <h3
          className="group-hover:text-emerald-400 transition-colors duration-200"
          style={{ ...sora(700,'0.9875rem','-0.025em',1.3), color:'#f1f5f9' }}
        >
          {product.name}
        </h3>

        {/* Description — Inter 400, soft color */}
        <p className="line-clamp-2" style={{ ...inter(400,'0.8125rem','0.005em',1.68), color:'#475569' }}>
          {product.description}
        </p>

        {/* ── Price + Cart CTA ──────────────────────────────── */}
        <div className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div className="flex items-baseline gap-1.5">
              {/* Price — Sora 700, prominent */}
              <span style={{ ...sora(700,'1.2rem','-0.035em',1), color:'#f8fafc' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span style={{ ...inter(400,'0.85rem','0.005em',1), color:'#334155', textDecoration:'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {/* Unit — Inter 400, faint */}
            <span style={{ ...inter(400,'0.72rem','0.01em',1), color:'#334155' }}>
              per {product.unit}
            </span>
          </div>

          {/* Add / qty controls */}
          {qty === 0 ? (
            <motion.button
              whileHover={{ scale:1.06 }} whileTap={{ scale:0.92 }}
              onClick={handleAdd}
              className="btn-primary flex items-center gap-1.5"
              style={{ padding:'0.45rem 1rem', fontSize:'0.85rem' }}
              id={`add-${product._id}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                <line x1="5"  y1="12" x2="19" y2="12" strokeWidth="2.5"/>
              </svg>
              Add
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
              className="flex items-center gap-2 glass rounded-xl px-1 py-1"
              id={`qty-${product._id}`}
            >
              <motion.button whileTap={{ scale:0.78 }} onClick={handleDecrease}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/18 transition-colors"
                style={{ background:'rgba(30,30,52,0.8)' }} id={`dec-${product._id}`}>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                </svg>
              </motion.button>

              {/* Quantity number — Sora 700 */}
              <motion.span key={qty}
                initial={{ scale:1.4, color:'#22c55e' }} animate={{ scale:1, color:'#4ade80' }}
                style={{ ...sora(700,'0.95rem','-0.02em',1), width:'1.5rem', textAlign:'center' }}>
                {qty}
              </motion.span>

              <motion.button whileTap={{ scale:0.78 }} onClick={handleIncrease}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/18 transition-colors"
                style={{ background:'rgba(30,30,52,0.8)' }} id={`inc-${product._id}`}>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                  <line x1="5"  y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                </svg>
              </motion.button>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  )
}
