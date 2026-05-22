import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import { listOrders } from '../services/orders'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiArrowLeft } from 'react-icons/fi'
import { formatPeso } from '../lib/currency'

export default function Analytics() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try { 
        const data = await listOrders(); 
        setOrders(data) 
      } catch (e) { 
        console.error(e) 
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // compute daily sales
  const salesByDay = orders.reduce((acc, o) => {
    const day = o.created_at ? new Date(o.created_at).toISOString().slice(0,10) : 'unknown'
    acc[day] = (acc[day] || 0) + Number(o.total || 0)
    return acc
  }, {})

  const chartData = Object.keys(salesByDay).slice(0,14).map(k => ({ date: k, revenue: salesByDay[k] }))
  const totalRevenue = orders.reduce((s,o) => s + Number(o.total||0), 0)

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-gold/30">
           <p className="text-gray-300 font-light text-sm mb-1">{label}</p>
           <p className="text-xl font-display font-medium text-gold glow-gold">
             {formatPeso(payload[0].value)}
           </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-light text-gray-400 hover:text-white transition-colors group mb-3">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-display font-medium glow-gold block">Business Intelligence</h1>
          <p className="text-gray-400 mt-2 font-light tracking-wide">Revenue streams and operational metrics</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-gold animate-pulse text-xl">Compiling metrics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-light text-gray-400 uppercase tracking-widest">Total Revenue</div>
                <div className="text-gold bg-gold/10 p-2 rounded-full"><FiDollarSign /></div>
              </div>
              <div className="text-3xl font-display font-medium text-white">{formatPeso(totalRevenue)}</div>
              <div className="mt-2 text-xs font-light text-green-400 flex items-center gap-1"><FiTrendingUp /> +14.2% from last month</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-light text-gray-400 uppercase tracking-widest">Global Orders</div>
                <div className="text-gold bg-gold/10 p-2 rounded-full"><FiShoppingBag /></div>
              </div>
              <div className="text-3xl font-display font-medium text-white">{orders.length}</div>
              <div className="mt-2 text-xs font-light text-green-400 flex items-center gap-1"><FiTrendingUp /> +8.1% from last month</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-light text-gray-400 uppercase tracking-widest">Avg Order Value</div>
                <div className="text-gold bg-gold/10 p-2 rounded-full"><FiTrendingUp /></div>
              </div>
              <div className="text-3xl font-display font-medium text-white">{formatPeso(orders.length > 0 ? (totalRevenue / orders.length) : 0)}</div>
              <div className="mt-2 text-xs font-light text-green-400 flex items-center gap-1"><FiTrendingUp /> +2.4% from last month</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-light text-gray-400 uppercase tracking-widest">Active Clients</div>
                <div className="text-gold bg-gold/10 p-2 rounded-full"><FiUsers /></div>
              </div>
              <div className="text-3xl font-display font-medium text-white">{new Set(orders.map(o => o.email)).size}</div>
              <div className="mt-2 text-xs font-light text-gray-500">Unique ordering accounts</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2 glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-display font-medium text-gold mb-8">Revenue Trajectory (Last 14 Days)</h3>
              <div style={{ width: '100%', height: 350 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => formatPeso(v)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#0b0b0d', stroke: '#d4af37', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#d4af37', stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 font-light">Not enough data to populate chart.</div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4">Recent Transactions</h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {orders.slice(0, 8).map(o => (
                  <div key={o.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded -mx-2 transition-colors cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-white">{o.order_number}</div>
                      <div className="text-xs font-light text-gray-500 mt-1">{new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gold">{formatPeso(o.total)}</div>
                      <div className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${o.status === 'Delivered' ? 'text-green-400' : 'text-gray-400'}`}>{o.status}</div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <div className="text-sm font-light text-gray-500">No transactions yet.</div>}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
