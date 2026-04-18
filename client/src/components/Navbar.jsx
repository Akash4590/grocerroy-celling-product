import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function Navbar({ onSearchChange, onCategoryChange, categories, activeCategory }) {
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    onSearchChange?.(e.target.value)
  }

  const handleCategory = (cat) => {
    onCategoryChange?.(cat)
    setMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold">
              Fresh<span className="gradient-text">Cart</span>
            </span>
          </Link>

          {/* Search Bar */}
          {location.pathname === '/' && (
            <div className="hidden sm:flex flex-1 max-w-md relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search groceries..."
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {location.pathname !== '/cart' && (
              <Link to="/cart" className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-medium hover:border-brand-500/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                    <path d="M16 10a4 4 0 01-8 0" strokeWidth="2"/>
                  </svg>
                  <span className="hidden sm:inline">Cart</span>
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key={itemCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {itemCount > 9 ? '9+' : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* Category Pills */}
        {location.pathname === '/' && categories?.length > 0 && (
          <div className="pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'gradient-brand text-white shadow-glow-green'
                    : 'glass text-slate-300 hover:text-white hover:border-brand-500/40'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Mobile Search */}
        {location.pathname === '/' && (
          <div className="sm:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search groceries..."
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
