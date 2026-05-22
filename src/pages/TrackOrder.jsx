import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { FiSearch, FiPackage, FiCheck, FiTruck } from 'react-icons/fi'
import { formatPeso } from '../lib/currency'

export default function TrackOrder() {
  const [form, setForm] = useState({ email: '' })
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  const statuses = ['Pending', 'Approved', 'Packaging', 'Out for Delivery', 'Delivered']

  const getStatusIndex = (status) => {
    return statuses.indexOf(status)
  }

  const track = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrders([])

    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .eq('email', form.email)
      .order('created_at', { ascending: false })

    setLoading(false)
    if (err) return setError('An error occurred querying the archives.')
    if (!data || data.length === 0) return setError('No orders found for this email address. Please verify your details.')
    setOrders(data)
  }

  return (
    <div className="py-24 px-6 max-w-4xl mx-auto min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-4 glow-gold">Logistics Tracking</h1>
        <p className="text-gray-400 font-light max-w-lg mx-auto">Monitor the provenance and secure transport of your luxury acquisitions in real-time.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 rounded-3xl max-w-2xl mx-auto mb-16 relative z-10">
        <form onSubmit={track} className="flex flex-col md:flex-row gap-4">

          <input 
            required 
            type="email"
            placeholder="Billing Email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            className="flex-1 p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" 
          />
          <button type="submit" disabled={loading} className="px-8 py-4 bg-gold text-black rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50">
            {loading ? 'Locating...' : <FiSearch size={20} />}
          </button>
        </form>
        {error && <p className="mt-4 text-rose-400 font-light text-center">{error}</p>}
      </motion.div>

      <div className="space-y-12">
      {orders.map(order => (
        <motion.div key={order.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 rounded-3xl border border-gold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent z-0" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-white/10">
              <div>
                <h2 className="text-sm font-light uppercase tracking-widest text-gold mb-2">Order Details</h2>
                <div className="text-3xl font-display font-medium text-white">{order.order_number}</div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-gray-400 font-light text-sm mb-1">{new Date(order.created_at).toLocaleDateString()}</div>
                <div className="text-xl font-medium text-white">{formatPeso(order.total)}</div>
              </div>
            </div>

            <div className="relative mt-8">
              {/* Timeline Track */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full hidden md:block" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 rounded-full transition-all duration-1000 hidden md:block shadow-[0_0_10px_rgba(212,175,55,0.8)]" 
                style={{ width: `${(Math.max(0, getStatusIndex(order.status)) / (statuses.length - 1)) * 100}%` }}
              />

              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                {statuses.map((s, i) => {
                  const currentIdx = getStatusIndex(order.status);
                  const isCompleted = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  
                  return (
                    <div key={s} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1 md:text-center">
                      <div className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500
                        ${isCompleted ? 'bg-gold border-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-black border-white/20 text-gray-500'}
                      `}>
                        {isCompleted ? <FiCheck size={18} /> : (i === 2 ? <FiPackage size={18} /> : (i === 3 ? <FiTruck size={18} /> : <div className="w-2 h-2 rounded-full bg-current" />))}
                      </div>
                      <div>
                        <div className={`text-sm md:text-base font-medium ${isCurrent ? 'text-gold glow-gold' : (isCompleted ? 'text-white' : 'text-gray-500')}`}>{s}</div>
                        {isCurrent && <div className="text-xs font-light text-gray-400 hidden md:block mt-1">Current State</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-12 bg-black/40 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-light uppercase tracking-widest text-gray-500 mb-3">Delivery Destination</h3>
                <p className="text-gray-300 font-light">{order.address}</p>
                {order.landmark && <p className="text-gray-400 font-light text-sm mt-1">Near: {order.landmark}</p>}
              </div>
              <div>
                <h3 className="text-xs font-light uppercase tracking-widest text-gray-500 mb-3">Scheduled Arrival</h3>
                <p className="text-gray-300 font-light">{new Date(order.delivery_date).toLocaleDateString()} at {order.delivery_time}</p>
                <p className="text-gray-400 font-light text-sm mt-1">Signature Required</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  )
}
