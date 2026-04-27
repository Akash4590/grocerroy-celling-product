import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { getProducts, getCategories } from '../services/api'
import { useCart } from '../context/CartContext'

/* ─── Motion variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'backOut' },
  }),
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

/* ─── Static data ─────────────────────────────────────────────── */
const FLOATERS = [
  { emoji: '🍅', x: '8%',  y: '12%', size: '4.5rem', delay: 0,   anim: 'slow'   },
  { emoji: '🥦', x: '82%', y: '8%',  size: '4rem',   delay: 0.8, anim: 'fast'   },
  { emoji: '🍋', x: '72%', y: '55%', size: '3.8rem', delay: 0.4, anim: 'medium' },
  { emoji: '🥛', x: '15%', y: '58%', size: '4rem',   delay: 1.0, anim: 'slow'   },
  { emoji: '🍞', x: '58%', y: '75%', size: '3.5rem', delay: 0.6, anim: 'fast'   },
  { emoji: '🍇', x: '38%', y: '20%', size: '5rem',   delay: 0.2, anim: 'medium' },
  { emoji: '🥕', x: '90%', y: '35%', size: '3.5rem', delay: 1.2, anim: 'slow'   },
  { emoji: '🍓', x: '3%',  y: '40%', size: '3.8rem', delay: 0.5, anim: 'fast'   },
]

const STATS = [
  { value: 50000,   suffix: '+',   label: 'Happy Customers',  icon: '😄', color: '#22c55e' },
  { value: 1200000, suffix: '+',   label: 'Orders Delivered', icon: '📦', color: '#3b82f6' },
  { value: 500,     suffix: '+',   label: 'Fresh Products',   icon: '🌿', color: '#f59e0b' },
  { value: 45,      suffix: 'min', label: 'Avg Delivery',     icon: '⚡', color: '#a855f7' },
]

const TESTIMONIALS = [
  { name: 'Sarah Johnson', role: 'Home Chef',          avatar: '👩‍🍳', text: 'FreshCart completely changed how I shop. The produce is always incredibly fresh and delivery is always on time!',                            rating: 5 },
  { name: 'Marcus Lee',    role: 'Fitness Enthusiast', avatar: '🏋️',  text: 'The organic selection is amazing. I find everything I need for meal prep and it arrives the same day. Love it!',                           rating: 5 },
  { name: 'Priya Sharma',  role: 'Busy Mom of 3',     avatar: '👩‍👧‍👦', text: 'Saves me so much time every week. Beautiful, easy to use, and their customer service is so helpful.',                                       rating: 5 },
  { name: 'James Carter',  role: 'Restaurant Owner',   avatar: '👨‍🍽️', text: 'We source daily ingredients from FreshCart. The quality is consistently excellent and bulk pricing is very competitive.',                   rating: 5 },
  { name: 'Aisha Patel',   role: 'Nutritionist',       avatar: '🥗',  text: "I recommend FreshCart to all my clients. Widest selection of healthy, organic options I've seen in any online grocery store.",              rating: 5 },
  { name: 'Tom Wilson',    role: 'College Student',    avatar: '🎓',  text: 'Affordable, fast, and great quality. As a student on a tight budget, the deals section is an absolute lifesaver every week!',               rating: 5 },
]

const FEATURES = [
  { icon: '🌿', title: 'Farm Fresh Quality',  desc: 'Sourced directly from local farms within 48 hours of harvest for peak freshness.',       grad: 'from-emerald-500/15 to-emerald-600/5', border: 'border-emerald-500/20' },
  { icon: '⚡', title: 'Lightning Delivery',   desc: 'Get your groceries in as little as 45 minutes. We operate 7 days a week, all year.',     grad: 'from-amber-500/15 to-amber-600/5',     border: 'border-amber-500/20'   },
  { icon: '🛡️', title: 'Quality Guarantee',   desc: 'Not satisfied? Full refund, no questions asked. We stand behind every item we deliver.', grad: 'from-blue-500/15 to-blue-600/5',       border: 'border-blue-500/20'    },
  { icon: '♻️', title: 'Eco-Friendly',         desc: 'All packaging is 100% recycled and compostable. Committed to a greener future.',         grad: 'from-teal-500/15 to-teal-600/5',       border: 'border-teal-500/20'    },
]

const CATEGORIES_SHOWCASE = [
  { name: 'Fresh Fruits', emoji: '🍎', count: 48, grad: 'from-rose-500/20 to-rose-600/5',    glow: 'rgba(244,63,94,0.15)'   },
  { name: 'Vegetables',   emoji: '🥦', count: 65, grad: 'from-emerald-500/20 to-emerald-600/5', glow: 'rgba(34,197,94,0.15)'  },
  { name: 'Dairy & Eggs', emoji: '🥛', count: 32, grad: 'from-amber-500/20 to-amber-600/5',  glow: 'rgba(245,158,11,0.15)'  },
  { name: 'Bakery',       emoji: '🍞', count: 27, grad: 'from-orange-500/20 to-orange-600/5',glow: 'rgba(249,115,22,0.15)'  },
  { name: 'Seafood',      emoji: '🐟', count: 22, grad: 'from-blue-500/20 to-blue-600/5',    glow: 'rgba(59,130,246,0.15)'  },
  { name: 'Snacks',       emoji: '🍿', count: 41, grad: 'from-purple-500/20 to-purple-600/5',glow: 'rgba(168,85,247,0.15)'  },
]

/* ─── Inline font-style helpers ───────────────────────────────── */
// Sora headings
const sora = (weight = 800, size, tracking = '-0.04em', lh = 1.1) => ({
  fontFamily: "'Sora', system-ui, sans-serif",
  fontWeight: weight,
  letterSpacing: tracking,
  lineHeight: lh,
  ...(size ? { fontSize: size } : {}),
})
// Inter UI / body
const inter = (weight = 400, size, tracking = '0.005em', lh = 1.75) => ({
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: weight,
  letterSpacing: tracking,
  lineHeight: lh,
  ...(size ? { fontSize: size } : {}),
})

/* ─── Background particles ────────────────────────────────────── */
function Particle({ x, y, size, color, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, backgroundColor: color }}
      animate={{ y: [0, -40, 0], x: [0, 10, -5, 0], opacity: [0.3, 0.7, 0.25, 0.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
function BackgroundParticles() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: `${Math.random() * 2.5 + 1}px`,
    color: i % 3 === 0 ? 'rgba(34,197,94,0.55)' : i % 3 === 1 ? 'rgba(139,92,246,0.45)' : 'rgba(59,130,246,0.4)',
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 3,
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => <Particle key={p.id} {...p} />)}
    </div>
  )
}

/* ─── Stat counter card ───────────────────────────────────────── */
function StatCard({ value, suffix, label, icon, color, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <motion.div
      ref={ref}
      variants={scaleIn} custom={index}
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="glass-card rounded-2xl p-7 text-center flex flex-col items-center gap-3 relative overflow-hidden group"
    >
      {/* Hover glow bg */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.06), transparent 65%)' }} />

      <span className="text-3xl select-none">{icon}</span>

      {/* The number — Sora 800, massive */}
      <div className="counter-glow" style={{ ...sora(800, '2.6rem', '-0.045em', 1), color }}>
        {inView
          ? <CountUp start={0} end={value} duration={2.5} separator="," suffix={suffix} useEasing />
          : <span>0{suffix}</span>
        }
      </div>

      {/* Label — Inter 500 */}
      <p style={{ ...inter(500, '0.85rem', '0.01em', 1.3), color: '#64748b' }}>{label}</p>
    </motion.div>
  )
}

/* ─── Testimonial card ────────────────────────────────────────── */
function TestimonialCard({ item }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 min-w-[320px] max-w-[340px] relative overflow-hidden shrink-0">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Stars — amber, Inter 600 */}
      <div className="flex text-amber-400 gap-px text-sm">
        {Array.from({ length: item.rating }).map((_, i) => <span key={i}>★</span>)}
      </div>

      {/* Review body — Inter 400, comfortable reading size */}
      <p style={{ ...inter(400, '0.9375rem', '0.005em', 1.72), color: '#cbd5e1', fontStyle: 'italic' }}>
        "{item.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/5">
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl shrink-0">
          {item.avatar}
        </div>
        <div>
          {/* Name — Sora 700 */}
          <div style={{ ...sora(700, '0.9rem', '-0.02em', 1.2), color: '#f1f5f9' }}>
            {item.name}
          </div>
          {/* Role — Inter 500 */}
          <div style={{ ...inter(500, '0.775rem', '0.01em', 1.3), color: '#64748b', marginTop: '2px' }}>
            {item.role}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
export default function Home({ searchQuery, activeCategory, onCategoryChange, onCategoriesLoaded }) {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const { itemCount } = useCart()

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 25, stiffness: 80 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 80 })
  const heroRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return
    const { left, top, width, height } = heroRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - left) / width  - 0.5) * 28)
    mouseY.set(((e.clientY - top)  / height - 0.5) * 18)
  }, [mouseX, mouseY])

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])

  // Fetch data
  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        if (data.success) { setCategories(data.data); onCategoriesLoaded?.(data.data) }
      }).catch(() => {})
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = {}
      if (activeCategory && activeCategory !== 'All') params.category = activeCategory
      if (searchQuery) params.search = searchQuery
      const { data } = await getProducts(params)
      if (data.success) setProducts(data.data)
    } catch {
      setError('Failed to load products. Make sure the backend is running.')
    } finally { setLoading(false) }
  }, [activeCategory, searchQuery])

  useEffect(() => { loadProducts() }, [loadProducts])

  const featured = products.filter(p => p.isFeatured).slice(0, 6)
  useEffect(() => {
    if (featured.length < 2) return
    const id = setInterval(() => setCarouselIdx(i => (i + 1) % featured.length), 4000)
    return () => clearInterval(id)
  }, [featured.length])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  /* ─────────────────  RENDER  ──────────────────────────────── */
  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden" style={{ background: '#05050a' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-center pt-32 pb-20 px-4 overflow-hidden"
      >
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-100" />
        <BackgroundParticles />

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale:[1,1.15,1], opacity:[0.6,1,0.6] }} transition={{ duration:8, repeat:Infinity }}
            className="absolute -top-32 -left-20 w-[700px] h-[700px] glow-orb-green" />
          <motion.div animate={{ scale:[1,1.2,1], opacity:[0.5,0.85,0.5] }} transition={{ duration:10, repeat:Infinity, delay:2 }}
            className="absolute -bottom-40 -right-24 w-[600px] h-[600px] glow-orb-purple" />
          <motion.div animate={{ scale:[1,1.1,1], opacity:[0.4,0.7,0.4] }} transition={{ duration:7, repeat:Infinity, delay:1 }}
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] glow-orb-blue" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: headline copy ───────────────────────── */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-8">

              {/* Overline pill — Inter 700, all-caps */}
              <motion.div variants={fadeUp} custom={0}>
                <span
                  className="inline-flex items-center gap-2.5 glass-hero rounded-full w-fit"
                  style={{
                    ...inter(700, '0.75rem', '0.18em', 1),
                    textTransform: 'uppercase',
                    color: '#4ade80',
                    padding: '0.55rem 1.25rem',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  🌿&nbsp; Farm Fresh · Delivered in 45 min
                </span>
              </motion.div>

              {/* ★ HERO HEADLINE — Sora 800, cinematic ★ */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                style={{
                  fontFamily: "'Sora', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(3rem, 7.5vw, 5.5rem)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.05em',
                  color: '#f8fafc',
                  textShadow: '0 0 80px rgba(34,197,94,0.22), 0 2px 10px rgba(0,0,0,0.65)',
                }}
              >
                Groceries that<br />
                feel like a{' '}
                <span className="gradient-text glow-text">
                  farmer's&nbsp;market
                </span>
              </motion.h1>

              {/* Sub-copy — Inter 400, large body size */}
              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-lg"
                style={{ ...inter(400, '1.1875rem', '0.005em', 1.82), color: '#94a3b8' }}
              >
                Handpicked produce, premium quality, delivered fresh to your doorstep.
                Free delivery on every order over&nbsp;$35.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-glow"
                  id="hero-shop-btn"
                >
                  Shop Now
                  <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    →
                  </motion.span>
                </motion.button>

                <Link to="/cart">
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="btn-outline"
                    id="hero-cart-btn"
                  >
                    View Cart
                    {itemCount > 0 && (
                      <span
                        className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        style={{ ...inter(700, '0.65rem'), lineHeight: 1 }}
                      >
                        {itemCount}
                      </span>
                    )}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Quick stats — Sora numbers + Inter labels */}
              <motion.div variants={fadeUp} custom={4} className="flex gap-10 pt-1">
                {[['50K+','Happy Customers'],['45min','Fast Delivery'],['$35','Free Shipping']].map(([val, label]) => (
                  <div key={label} className="flex flex-col">
                    <span className="gradient-text" style={{ ...sora(800, '1.75rem', '-0.045em', 1) }}>{val}</span>
                    <span style={{ ...inter(500, '0.8rem', '0.02em', 1.4), color: '#475569', marginTop: '4px' }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: floating emoji scene ──────────────── */}
            <motion.div
              style={{ x: springX, y: springY }}
              className="hidden lg:relative lg:flex items-center justify-center h-[520px]"
            >
              {/* Soft center glow */}
              <motion.div animate={{ scale:[1,1.12,1], opacity:[0.5,0.85,0.5] }} transition={{ duration:5, repeat:Infinity }}
                className="absolute w-72 h-72 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)' }} />
              {/* Rotating rings */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                className="absolute w-80 h-80 rounded-full border border-dashed border-emerald-500/18" />
              <motion.div animate={{ rotate:-360 }} transition={{ duration:30, repeat:Infinity, ease:'linear' }}
                className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-purple-500/10" />

              {/* Floating items */}
              {FLOATERS.map(({ emoji, x, y, size, delay, anim }) => (
                <motion.div key={emoji}
                  initial={{ scale:0, opacity:0 }}
                  animate={{ scale:1, opacity:1 }}
                  transition={{ delay, duration:0.6, ease:'backOut' }}
                  className={`absolute select-none float-${anim}`}
                  style={{ left:x, top:y, fontSize:size, filter:'drop-shadow(0 8px 28px rgba(0,0,0,0.55))' }}
                >
                  {emoji}
                </motion.div>
              ))}

              {/* Central brand card */}
              <motion.div
                initial={{ scale:0, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                transition={{ delay:0.5, duration:0.7, ease:'backOut' }}
                className="glass-hero rounded-3xl px-9 py-7 text-center z-10"
                style={{ boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}
              >
                <div className="gradient-text" style={{ ...sora(800, '2.1rem', '-0.05em', 1) }}>FreshCart</div>
                <div style={{ ...inter(400, '0.825rem', '0.01em', 1.4), color:'#64748b', marginTop:'6px' }}>
                  Premium Grocery Experience
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span style={{ ...inter(600, '0.775rem', '0.04em', 1), color:'#4ade80' }}>
                    Live Delivery Tracking
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span style={{ ...inter(600, '0.65rem', '0.22em', 1), color:'#334155', textTransform:'uppercase' }}>
            Scroll
          </span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }}
            className="w-5 h-8 rounded-full border border-slate-700/60 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-emerald-500" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 section-divider overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] glow-orb-green opacity-35" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="text-center mb-18">
            <div className="mb-4">
              <span
                className="text-overline"
                style={{ color:'#22c55e', ...inter(700,'0.7rem','0.2em',1), textTransform:'uppercase' }}
              >
                Why FreshCart
              </span>
            </div>
            <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9', marginBottom:'1rem' }}>
              Premium experience,{' '}
              <span className="gradient-text">every time</span>
            </h2>
            <p style={{ ...inter(400,'1.0625rem','0.005em',1.8), color:'#64748b', maxWidth:'520px', margin:'0 auto' }}>
              We obsess over quality so you don't have to. Every feature designed with your satisfaction in mind.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once:true }}
                whileHover={{ y:-8, scale:1.02 }}
                className={`glass-card rounded-2xl p-7 flex flex-col gap-5 border bg-gradient-to-br ${f.grad} ${f.border} group relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background:'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.06), transparent 70%)' }} />
                <span className="text-4xl">{f.icon}</span>
                <div>
                  {/* Card heading — Sora 700 */}
                  <h3 style={{ ...sora(700,'1.05rem','-0.025em',1.25), color:'#f1f5f9', marginBottom:'8px' }}>
                    {f.title}
                  </h3>
                  {/* Card body — Inter 400 */}
                  <p style={{ ...inter(400,'0.9rem','0.005em',1.72), color:'#64748b' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CATEGORY SHOWCASE
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 section-divider overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="text-center mb-14">
            <div className="mb-4">
              <span style={{ color:'#a855f7', ...inter(700,'0.7rem','0.2em',1), textTransform:'uppercase' }}>
                Browse by Category
              </span>
            </div>
            <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9' }}>
              Everything you need,{' '}
              <span className="gradient-text">in one place</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_SHOWCASE.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={scaleIn} custom={i}
                initial="hidden" whileInView="visible" viewport={{ once:true }}
                whileHover={{ y:-10, scale:1.06 }} whileTap={{ scale:0.95 }}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior:'smooth' })}
                className={`glass-card rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer bg-gradient-to-br ${cat.grad} relative overflow-hidden group`}
                id={`cat-${cat.name.replace(/\s+/g,'-').toLowerCase()}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ boxShadow:`inset 0 0 40px ${cat.glow}` }} />
                <motion.div className="text-4xl"
                  animate={{ y:[0,-7,0] }}
                  transition={{ duration:3+i*0.5, repeat:Infinity, ease:'easeInOut', delay:i*0.3 }}>
                  {cat.emoji}
                </motion.div>
                <div className="text-center">
                  {/* Category name — Sora 700 */}
                  <div style={{ ...sora(700,'0.875rem','-0.02em',1.25), color:'#f1f5f9' }}>{cat.name}</div>
                  {/* Count — Inter 500 */}
                  <div style={{ ...inter(500,'0.75rem','0.01em',1.3), color:'#475569', marginTop:'3px' }}>
                    {cat.count} items
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURED PRODUCT CAROUSEL
      ═══════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="relative py-28 px-4 section-divider overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] glow-orb-purple opacity-28 pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
              className="flex items-center justify-between mb-12">
              <div>
                <span style={{ color:'#f59e0b', ...inter(700,'0.7rem','0.2em',1), textTransform:'uppercase' }}>
                  Featured
                </span>
                <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9', marginTop:'12px' }}>
                  <span className="gradient-text-warm">Staff picks</span> this week
                </h2>
              </div>
              {/* Carousel dots */}
              <div className="flex gap-2">
                {featured.map((_, i) => (
                  <button key={i} onClick={() => setCarouselIdx(i)} id={`dot-${i}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === carouselIdx
                        ? 'w-8 h-2.5 bg-emerald-500 shadow-glow-green'
                        : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <div className="overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.div key={carouselIdx}
                  initial={{ opacity:0, x:80, scale:0.96 }}
                  animate={{ opacity:1, x:0, scale:1 }}
                  exit={{ opacity:0, x:-80, scale:0.96 }}
                  transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
                  {featured[carouselIdx] && (
                    <div className="glass-card rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
                      style={{ border:'1px solid rgba(34,197,94,0.1)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                      {/* Big emoji */}
                      <motion.div animate={{ y:[0,-16,0], rotate:[0,3,-3,0] }}
                        transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                        className="text-[9rem] select-none shrink-0">
                        {featured[carouselIdx].image}
                      </motion.div>

                      {/* Product details */}
                      <div className="flex flex-col gap-5 flex-1 z-10">
                        {/* Category micro-label — Inter 700, caps */}
                        <span style={{ ...inter(700,'0.72rem','0.16em',1), color:'#22c55e', textTransform:'uppercase' }}>
                          {featured[carouselIdx].category}
                        </span>

                        {/* Product name — Sora 800 */}
                        <h3 style={{ ...sora(800,'clamp(1.75rem,3.5vw,2.5rem)','-0.04em',1.05), color:'#f8fafc' }}>
                          {featured[carouselIdx].name}
                        </h3>

                        {/* Description — Inter 400 */}
                        <p style={{ ...inter(400,'1.0625rem','0.005em',1.78), color:'#64748b' }}>
                          {featured[carouselIdx].description}
                        </p>

                        {/* Price row — Sora 800 for price */}
                        <div className="flex items-baseline gap-3">
                          <span style={{ ...sora(800,'2.4rem','-0.04em',1), color:'#f8fafc' }}>
                            ${featured[carouselIdx].price.toFixed(2)}
                          </span>
                          {featured[carouselIdx].originalPrice && (
                            <span style={{ ...inter(400,'1.1rem','0.005em',1), color:'#334155', textDecoration:'line-through' }}>
                              ${featured[carouselIdx].originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span style={{ ...inter(400,'0.875rem','0.01em',1), color:'#475569' }}>
                            per {featured[carouselIdx].unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior:'smooth' })}
                            className="btn-primary" id="carousel-shop-btn">
                            Add to Cart →
                          </motion.button>
                          <div className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl">
                            <span className="text-amber-400 text-sm">★</span>
                            <span style={{ ...sora(700,'0.9rem','-0.02em',1), color:'#f8fafc' }}>
                              {featured[carouselIdx].rating?.toFixed(1)}
                            </span>
                            <span style={{ ...inter(400,'0.775rem','0.01em',1), color:'#475569' }}>
                              ({featured[carouselIdx].reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Slide counter */}
                      <div className="absolute bottom-5 right-7"
                        style={{ ...inter(500,'0.8rem','0.06em',1), color:'#334155' }}>
                        {String(carouselIdx+1).padStart(2,'0')} / {String(featured.length).padStart(2,'0')}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          PRODUCTS GRID
      ═══════════════════════════════════════════════════════ */}
      <section id="products" className="relative py-28 px-4 section-divider overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <span style={{ ...inter(700,'0.7rem','0.2em',1), color:'#22c55e', textTransform:'uppercase' }}>
                Our Selection
              </span>
              <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9', marginTop:'12px' }}>
                {activeCategory && activeCategory !== 'All'
                  ? <span className="gradient-text">{activeCategory}</span>
                  : <><span className="gradient-text">All</span>{' '}Products</>
                }
              </h2>
              <p style={{ ...inter(400,'0.9rem','0.01em',1.5), color:'#475569', marginTop:'8px' }}>
                {loading ? 'Loading fresh picks…' : `${products.length} items available`}
              </p>
            </div>

            {/* Filter pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0,5).map(cat => (
                  <motion.button key={cat}
                    whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                    onClick={() => onCategoryChange?.(cat)}
                    id={`filter-${cat.replace(/\s+/g,'').toLowerCase()}`}
                    className={`rounded-full px-4 py-1.5 transition-all duration-200 ${
                      activeCategory === cat
                        ? 'gradient-brand text-white shadow-glow-green'
                        : 'glass text-slate-300 hover:text-white'
                    }`}
                    style={{ ...inter(600,'0.8rem','0.018em',1) }}>
                    {cat}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="text-center py-20 glass-card rounded-2xl">
              <div className="text-5xl mb-4">⚠️</div>
              <p style={{ ...inter(500,'1rem','0.005em',1.6), color:'#f87171' }}>{error}</p>
              <button onClick={loadProducts} className="btn-outline mt-6" id="retry-btn">Retry</button>
            </motion.div>
          )}

          {/* Product grid */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="wait">
                {loading
                  ? Array.from({ length:8 }).map((_,i) => <ProductCardSkeleton key={i} />)
                  : products.length === 0
                    ? (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                        className="col-span-full text-center py-24">
                        <div className="text-6xl mb-5">🔍</div>
                        <p style={{ ...sora(700,'1.2rem','-0.025em',1.3), color:'#475569' }}>No products found</p>
                        <p style={{ ...inter(400,'0.9375rem','0.005em',1.7), color:'#334155', marginTop:'8px' }}>
                          Try a different search or category
                        </p>
                      </motion.div>
                    )
                    : products.map((p,i) => <ProductCard key={p._id} product={p} index={i} />)
                }
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS / COUNTERS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 section-divider overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] glow-orb-green opacity-22" />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="text-center mb-14">
            <div className="mb-4">
              <span style={{ color:'#22c55e', ...inter(700,'0.7rem','0.2em',1), textTransform:'uppercase' }}>
                By the Numbers
              </span>
            </div>
            <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9' }}>
              Trusted by <span className="gradient-text">thousands</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s,i) => <StatCard key={s.label} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 section-divider overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="text-center">
            <div className="mb-4">
              <span style={{ color:'#a855f7', ...inter(700,'0.7rem','0.2em',1), textTransform:'uppercase' }}>
                Testimonials
              </span>
            </div>
            <h2 style={{ ...sora(800,'clamp(2rem,4.5vw,3rem)','-0.04em',1.1), color:'#f1f5f9' }}>
              What our customers <span className="gradient-text">say</span>
            </h2>
          </motion.div>
        </div>

        {/* Auto-scroll row 1 */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-[#05050a] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-[#05050a] to-transparent" />
          <div className="auto-scroll flex gap-5 w-max px-8">
            {[...TESTIMONIALS,...TESTIMONIALS].map((t,i) => <TestimonialCard key={i} item={t} />)}
          </div>
        </div>

        {/* Auto-scroll row 2 (reversed) */}
        <div className="overflow-hidden relative mt-5">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-[#05050a] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-[#05050a] to-transparent" />
          <div className="flex gap-5 w-max px-8" style={{ animation:'scroll-x 35s linear infinite reverse' }}>
            {[...TESTIMONIALS.slice().reverse(),...TESTIMONIALS.slice().reverse()].map((t,i) => (
              <TestimonialCard key={i} item={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 section-divider overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale:[1,1.2,1], rotate:[0,12,0] }} transition={{ duration:14, repeat:Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
            style={{ background:'radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)' }} />
        </div>

        <div className="max-w-2xl mx-auto relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="animated-border rounded-3xl text-center flex flex-col items-center gap-8"
            style={{ background:'rgba(8,8,18,0.88)', backdropFilter:'blur(48px)', padding:'clamp(2.5rem,5vw,4rem)' }}>

            {/* Floating icons */}
            <div className="flex items-center justify-center gap-2">
              <motion.span animate={{ y:[0,-8,0] }} transition={{ duration:2.5, repeat:Infinity }} className="text-4xl inline-block">🥑</motion.span>
              <motion.span animate={{ y:[0,-11,0] }} transition={{ duration:3, repeat:Infinity, delay:0.5 }} className="text-5xl inline-block">💌</motion.span>
              <motion.span animate={{ y:[0,-8,0] }} transition={{ duration:2.8, repeat:Infinity, delay:1 }} className="text-4xl inline-block">🍓</motion.span>
            </div>

            {/* Headline — Sora 800 */}
            <div>
              <h2 style={{ ...sora(800,'clamp(1.75rem,4vw,2.6rem)','-0.04em',1.08), color:'#f8fafc', marginBottom:'1rem' }}>
                Get <span className="gradient-text">exclusive deals</span> &amp; recipes
              </h2>
              <p style={{ ...inter(400,'1.0625rem','0.005em',1.82), color:'#64748b', maxWidth:'460px', margin:'0 auto' }}>
                Join 50,000+ food lovers. Get weekly deals, seasonal recipes, and first access to new products. No spam, ever.
              </p>
            </div>

            {/* Subscribe form */}
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div key="ok"
                  initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  className="flex items-center gap-3 glass-hero px-8 py-4 rounded-2xl">
                  <span className="text-2xl">🎉</span>
                  <span style={{ ...inter(600,'1rem','0.01em',1.4), color:'#4ade80' }}>
                    You're subscribed! Check your inbox.
                  </span>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-lg" id="newsletter-form">
                  <input
                    type="email" value={email} required
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    id="newsletter-email"
                    className="input-field flex-1"
                    style={{ padding:'0.875rem 1rem', fontSize:'0.9375rem' }}
                  />
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                    type="submit" className="btn-glow whitespace-nowrap" id="newsletter-submit">
                    Subscribe Free →
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <p style={{ ...inter(400,'0.8rem','0.01em',1.5), color:'#334155' }}>
              🔒 Privacy first · Unsubscribe anytime · No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer className="relative border-t py-12 px-4" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛒</span>
            <span style={{ ...sora(800,'1.35rem','-0.04em',1) }}>
              Fresh<span className="gradient-text">Cart</span>
            </span>
          </div>

          {/* Copyright */}
          <p style={{ ...inter(400,'0.875rem','0.01em',1.5), color:'#334155', textAlign:'center' }}>
            © {new Date().getFullYear()} FreshCart · Premium groceries, delivered with love 🌿
          </p>

          {/* Links */}
          <div className="flex gap-5">
            {['Privacy','Terms','Support'].map(item => (
              <a key={item} href="#"
                style={{ ...inter(500,'0.875rem','0.01em',1), color:'#334155', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#22c55e'}
                onMouseLeave={e => e.target.style.color = '#334155'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
