import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiBox, FiClock, FiShoppingBag } from 'react-icons/fi'
import { listOrders } from '../services/orders'
import { listWines } from '../services/wines'

const ACTIVE_ORDER_STATUSES = ['Pending', 'Approved', 'Packaging', 'Ready for Delivery', 'Out for Delivery']

export default function StaffOverview() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [wines, setWines] = useState([])

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const [orderData, wineData] = await Promise.all([listOrders(), listWines()])
        if (!mounted) return
        setOrders(orderData || [])
        setWines(wineData || [])
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length
    const lowStock = wines.filter((w) => Number(w.stock || 0) <= 5).length

    return { activeOrders, pendingOrders, lowStock }
  }, [orders, wines])

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-display font-medium glow-gold inline-block">Staff Dashboard</h1>
        <p className="text-gray-400 mt-2 font-light tracking-wide">Monitor today&apos;s workload and jump into orders or store updates.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FiShoppingBag size={20} />}
          label="Active Orders"
          value={loading ? '...' : stats.activeOrders}
          tone="gold"
        />
        <StatCard
          icon={<FiClock size={20} />}
          label="Pending Approval"
          value={loading ? '...' : stats.pendingOrders}
          tone="blue"
        />
        <StatCard
          icon={<FiAlertTriangle size={20} />}
          label="Low Stock Wines"
          value={loading ? '...' : stats.lowStock}
          tone="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-2xl">
          <h2 className="text-xl font-display text-white mb-2">Manage Orders</h2>
          <p className="text-gray-400 font-light mb-6">Review incoming orders, inspect details, and move them through fulfillment statuses.</p>
          <Link
            to="/staff/orders"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-white transition-colors"
          >
            Open Orders Queue
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-2xl">
          <h2 className="text-xl font-display text-white mb-2">Manage Store</h2>
          <p className="text-gray-400 font-light mb-6">Update wine listings, adjust stock, and keep the online store accurate for customers.</p>
          <Link
            to="/staff/store"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            <FiBox size={16} /> Open Store Manager
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, tone }) {
  const tones = {
    gold: 'border-gold/30 text-gold',
    blue: 'border-sky-400/30 text-sky-300',
    rose: 'border-rose-400/30 text-rose-300'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className={`w-11 h-11 rounded-full border flex items-center justify-center mb-4 ${tones[tone] || tones.gold}`}>
        {icon}
      </div>
      <div className="text-3xl font-display text-white">{value}</div>
      <div className="text-sm font-light text-gray-400 mt-1">{label}</div>
    </motion.div>
  )
}
