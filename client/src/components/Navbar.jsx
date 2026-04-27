import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const inter = (w=400, sz, tr='0.005em', lh=1.5) => ({
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: w,
  letterSpacing: tr,
  lineHeight: lh,
  ...(sz ? { fontSize:sz } : {}),
})
const sora = (w=800, sz, tr='-0.04em', lh=1) => ({
  fontFamily: "'Sora', system-ui, sans-serif",
  fontWeight: w,
  letterSpacing: tr,
  lineHeight: lh,
  ...(sz ? { fontSize:sz } : {}),
})

export default function Navbar({ onSearchChange, onCategoryChange, categories, activeCategory }) {
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch   = e => { setSearchQuery(e.target.value); onSearchChange?.(e.target.value) }
  const handleCategory = cat => onCategoryChange?.(cat)

  return (
    <motion.header
      initial={{ y:-80, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo — Sora 800 ───────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" id="nav-logo">
            <span className="text-2xl">🛒</span>
            {/* "Fresh" in white, "Cart" in gradient — both Sora 800 */}
            <span style={{ ...sora(800,'1.35rem','-0.045em',1), color:'#f8fafc' }}>
              Fresh<span className="gradient-text">Cart</span>
            </span>
          </Link>

          {/* ── Search input — Inter 400 ─────────────────── */}
          {location.pathname === '/' && (
            <div className="hidden sm:flex flex-1 max-w-sm relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2"/>
              </svg>
              <input
                type="text" value={searchQuery} onChange={handleSearch}
                placeholder="Search fresh groceries…"
                id="nav-search"
                className="input-field pl-10 h-10"
                style={{ ...inter(400,'0.9rem','0.008em',1) }}
              />
            </div>
          )}

          {/* ── Cart button — Inter 600 ──────────────────── */}
          <div className="flex items-center gap-3">
            {location.pathname !== '/cart' && (
              <Link to="/cart" id="nav-cart-link">
                <motion.button
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  id="nav-cart-btn"
                  className="flex items-center gap-2 glass rounded-xl px-4 py-2 hover:border-emerald-500/35 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                    <path d="M16 10a4 4 0 01-8 0" strokeWidth="2"/>
                  </svg>
                  {/* "Cart" label — Inter 600 */}
                  <span className="hidden sm:inline text-slate-200"
                    style={inter(600,'0.875rem','0.01em',1)}>
                    Cart
                  </span>
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span key={itemCount}
                        initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                        className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        style={inter(700,'0.65rem','0.01em',1)}>
                        {itemCount > 9 ? '9+' : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Category pills — Inter 600 ───────────────── */}
        {location.pathname === '/' && categories?.length > 0 && (
          <div className="pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                onClick={() => handleCategory(cat)}
                id={`nav-cat-${cat.replace(/\s+/g,'-').toLowerCase()}`}
                className={`shrink-0 px-4 py-1.5 rounded-full transition-all duration-200 ${
                  activeCategory === cat
                    ? 'gradient-brand text-white shadow-glow-green'
                    : 'glass text-slate-300 hover:text-white'
                }`}
                style={inter(600,'0.8rem','0.018em',1)}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Mobile Search ────────────────────────────── */}
        {location.pathname === '/' && (
          <div className="sm:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2"/>
              </svg>
              <input type="text" value={searchQuery} onChange={handleSearch}
                placeholder="Search groceries…"
                id="nav-search-mobile"
                className="input-field pl-10"
                style={{ ...inter(400,'0.9rem','0.008em',1), padding:'0.6rem 1rem 0.6rem 2.5rem' }}
              />
            </div>
          </div>
        )}

      </div>
    </motion.header>
  )
}
