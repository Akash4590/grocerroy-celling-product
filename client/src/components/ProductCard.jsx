import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

const badgeColors = {
  Organic: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
  Popular: 'bg-accent-purple/20 text-purple-400 border border-purple-500/30',
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

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem(product, 1)
  }

  const handleIncrease = (e) => {
    e.stopPropagation()
    updateItem(product._id, qty + 1)
  }

  const handleDecrease = (e) => {
    e.stopPropagation()
    updateItem(product._id, qty - 1)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card group cursor-pointer flex flex-col overflow-hidden"
      style={{ borderRadius: '20px' }}
    >
      {/* Image Area */}
      <div className="relative bg-dark-700 flex items-center justify-center h-44 overflow-hidden">
        <motion.div
          className="text-7xl select-none"
          whileHover={{ scale: 1.15, rotate: [-2, 2, -2, 0] }}
          transition={{ duration: 0.4 }}
        >
          {product.image}
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className={`badge ${badgeColors[product.badge] || 'bg-slate-500/20 text-slate-400'}`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">
              -{discount}%
            </span>
          )}
        </div>

        {/* Stock Warning */}
        {product.stock < 20 && (
          <span className="absolute bottom-2 right-3 text-xs text-amber-400 font-medium">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs text-slate-400">{product.rating?.toFixed(1)}</span>
            <span className="text-xs text-slate-600">({product.reviewCount})</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-white text-base leading-tight group-hover:text-brand-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-slate-600 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="text-xs text-slate-600">per {product.unit}</span>
          </div>

          {/* Cart Controls */}
          {qty === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleAdd}
              className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
              </svg>
              Add
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 glass rounded-xl px-1 py-1"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleDecrease}
                className="w-7 h-7 rounded-lg bg-dark-600 text-white flex items-center justify-center hover:bg-brand-500/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                </svg>
              </motion.button>
              <motion.span
                key={qty}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="w-6 text-center text-sm font-bold text-brand-400"
              >
                {qty}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleIncrease}
                className="w-7 h-7 rounded-lg bg-dark-600 text-white flex items-center justify-center hover:bg-brand-500/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2.5"/>
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
                </svg>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
