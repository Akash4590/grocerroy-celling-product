import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { getProducts, getCategories } from '../services/api'
import { useCart } from '../context/CartContext'

export default function Home({ searchQuery, activeCategory, onCategoryChange, onCategoriesLoaded }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { itemCount, total } = useCart()

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        if (data.success) {
          setCategories(data.data)
          onCategoriesLoaded?.(data.data)
        }
      })
      .catch(() => {})
  }, [])

  // Load products whenever search or category changes
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (activeCategory && activeCategory !== 'All') params.category = activeCategory
      if (searchQuery) params.search = searchQuery
      const { data } = await getProducts(params)
      if (data.success) setProducts(data.data)
    } catch {
      setError('Failed to load products. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, searchQuery])

  useEffect(() => { loadProducts() }, [loadProducts])

  const featured = products.filter(p => p.isFeatured).slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 text-sm text-brand-400 font-medium glass px-4 py-2 rounded-full w-fit"
              >
                🌿 Farm Fresh · Delivered in 45 min
              </motion.span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Groceries that feel like a{' '}
                <span className="gradient-text">farmer's market</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed">
                Handpicked produce, premium quality, delivered to your doorstep.
                Free delivery on orders over $35.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary flex items-center gap-2"
                >
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
                <Link to="/cart">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-outline flex items-center gap-2"
                  >
                    View Cart {itemCount > 0 && <span className="badge gradient-brand">{itemCount}</span>}
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-2">
                {[['20+', 'Fresh Products'], ['45min', 'Delivery'], ['$35', 'Free Shipping']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-black gradient-text">{val}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating emojis */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center justify-center relative h-80"
            >
              {[
                { emoji: '🍎', x: '10%', y: '10%', delay: 0, size: '5rem' },
                { emoji: '🥦', x: '60%', y: '5%', delay: 0.1, size: '4rem' },
                { emoji: '🥛', x: '75%', y: '45%', delay: 0.2, size: '4.5rem' },
                { emoji: '🍞', x: '55%', y: '70%', delay: 0.3, size: '4rem' },
                { emoji: '🐟', x: '5%', y: '60%', delay: 0.4, size: '4.5rem' },
                { emoji: '🍓', x: '35%', y: '35%', delay: 0.15, size: '6rem' },
              ].map(({ emoji, x, y, delay, size }) => (
                <motion.div
                  key={emoji}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1, opacity: 1,
                    y: [0, -12, 0],
                  }}
                  transition={{
                    scale: { delay, duration: 0.5 },
                    opacity: { delay, duration: 0.5 },
                    y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute"
                  style={{ left: x, top: y, fontSize: size }}
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────── */}
      <section id="products" className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeCategory && activeCategory !== 'All' ? activeCategory : 'All Products'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {loading ? 'Loading...' : `${products.length} items available`}
              </p>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass rounded-2xl"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-400 font-medium">{error}</p>
              <button onClick={loadProducts} className="btn-outline mt-4">Retry</button>
            </motion.div>
          )}

          {/* Grid */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="wait">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.length === 0
                    ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center py-20"
                      >
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-slate-400 text-lg font-medium">No products found</p>
                        <p className="text-slate-600 text-sm mt-1">Try a different search or category</p>
                      </motion.div>
                    )
                    : products.map((product, i) => (
                      <ProductCard key={product._id} product={product} index={i} />
                    ))
                }
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
