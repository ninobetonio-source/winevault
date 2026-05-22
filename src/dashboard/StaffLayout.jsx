import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiShoppingBag, FiBox, FiArrowLeft, FiLogOut } from 'react-icons/fi'

export default function StaffLayout() {
  const loc = useLocation()

  const navItems = [
    { to: '/staff', title: 'Overview', icon: <FiGrid size={20} /> },
    { to: '/staff/orders', title: 'Orders', icon: <FiShoppingBag size={20} /> },
    { to: '/staff/store', title: 'Store', icon: <FiBox size={20} /> }
  ]

  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] bg-[#0b0b0d]">
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 md:w-64 border-r border-white/5 flex flex-col justify-between py-8 px-4 bg-black/30 backdrop-blur-md sticky top-[80px] h-[calc(100vh-80px)]"
      >
        <div>
          <div className="mb-10 flex items-center justify-center md:justify-start md:px-4">
            <Link to="/staff" className="text-xl md:text-2xl font-display font-medium text-gold glow-gold tracking-widest hidden md:block">
              STAFF HUB
            </Link>
            <Link to="/staff" className="text-2xl font-display font-medium text-gold glow-gold md:hidden">
              SH
            </Link>
          </div>

          <nav className="space-y-4">
            {navItems.map((item) => {
              const active = loc.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-center md:justify-start gap-4 p-3 md:px-5 rounded-2xl transition-all duration-300 group ${active ? 'bg-gold/10 text-gold shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] glow-border' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="hidden md:block font-light whitespace-nowrap">{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <Link to="/" className="flex items-center justify-center md:justify-start gap-4 p-3 md:px-5 rounded-2xl transition-all duration-300 text-gray-500 hover:text-white hover:bg-white/5 group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="hidden md:block font-light">Public Store</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('dev_admin')
              window.location.href = '/login'
            }}
            className="w-full flex items-center justify-center md:justify-start gap-4 p-3 md:px-5 rounded-2xl transition-all duration-300 text-rose-500/70 hover:text-rose-400 hover:bg-rose-900/20 group"
          >
            <FiLogOut size={20} />
            <span className="hidden md:block font-light">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 min-w-0 max-w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={loc.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full relative z-10 p-[1px]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
