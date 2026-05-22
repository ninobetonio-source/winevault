import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiShoppingCart } from 'react-icons/fi'

export default function Header() {
  const { items = [] } = useCart()
  const { user } = useAuth()
  const loc = useLocation()
  
  const count = items.reduce((acc, item) => acc + item.qty, 0)
  const isDashboard = loc.pathname.startsWith('/admin') || loc.pathname.startsWith('/staff')
  const canAccessDashboard = user?.role === 'admin' || user?.role === 'staff'
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/staff'

  return (
    <motion.header 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-between px-8 py-5 glass-header sticky top-0 z-50 w-full"
    >
      <Link to="/" className="text-3xl font-display font-semibold tracking-wide flex items-center gap-2">
        <span className="text-gold font-display">Wine</span>
        <span className="font-display text-white/90">Vault</span>
      </Link>
      {/* Navigation: show compact nav when in dashboard (cp), otherwise show desktop nav */}
      {isDashboard ? (
        <nav className="flex items-center gap-4 font-light text-sm overflow-x-auto">
          <Link to="/" className="hover:text-gold transition-colors tracking-wide whitespace-nowrap">Home</Link>
          <Link to="/wines" className="hover:text-gold transition-colors tracking-wide whitespace-nowrap">Menu</Link>
          <Link to="/about" className="hover:text-gold transition-colors tracking-wide whitespace-nowrap">About Us</Link>
          <Link to="/track" className="hover:text-gold transition-colors tracking-wide whitespace-nowrap">Track Order</Link>
        </nav>
      ) : (
        <nav className="items-center gap-8 font-light text-sm hidden md:flex">
          <Link to="/" className="hover:text-gold transition-colors tracking-wide">Home</Link>
          <Link to="/wines" className="hover:text-gold transition-colors tracking-wide">Menu</Link>
          <Link to="/about" className="hover:text-gold transition-colors tracking-wide">About Us</Link>
          <Link to="/track" className="hover:text-gold transition-colors tracking-wide">Track Order</Link>
        </nav>
      )}
      <div className="flex items-center gap-6">
        {!isDashboard && (
          <Link to="/cart" className="relative hover:text-gold transition-colors flex items-center justify-center w-10 h-10 border border-white/10 hover:border-gold/50 rounded-full" aria-label="Open cart">
            <FiShoppingCart id="cart-fly-target" size={18} />
            {count > 0 && <span className="absolute -top-2 -right-1 bg-burgundy text-white text-[10px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center">{count}</span>}
          </Link>
        )}
        {canAccessDashboard ? (
          <Link to={dashboardPath} className="text-sm px-6 py-2 bg-transparent border border-gold/50 text-gold hover:bg-gold hover:text-black rounded-full transition-all duration-300 font-medium tracking-wide">
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-sm px-6 py-2 bg-transparent border border-gold/50 text-gold hover:bg-gold hover:text-black rounded-full transition-all duration-300 font-medium tracking-wide">
            Log In
          </Link>
        )}
      </div>
    </motion.header>
  )
}
