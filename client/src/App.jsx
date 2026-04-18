import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState([])

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans">
      <Navbar
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <Home
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onCategoriesLoaded={setCategories}
                />
              </motion.div>
            }
          />
          <Route
            path="/cart"
            element={
              <motion.div key="cart" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <Cart />
              </motion.div>
            }
          />
          <Route
            path="/checkout"
            element={
              <motion.div key="checkout" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <Checkout />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
