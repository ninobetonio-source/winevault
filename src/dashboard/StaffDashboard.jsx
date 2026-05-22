import React, { useEffect, useState } from 'react'
import { listOrders, listOrderItems, updateOrderStatus } from '../services/orders'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPeso } from '../lib/currency'

const STATUSES = ['Pending', 'Approved', 'Packaging', 'Ready for Delivery', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function StaffDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [items, setItems] = useState([])

  async function load() {
    setLoading(true)
    try { const data = await listOrders(); setOrders(data) } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function viewOrder(o) {
    setSelected(o)
    try { const its = await listOrderItems(o.id); setItems(its) } catch (e) { console.error(e) }
  }

  async function changeStatus(id, status) {
    try { 
      await updateOrderStatus(id, status); 
      await load(); 
      if (selected && selected.id === id) setSelected({ ...selected, status }) 
    } catch (e) { console.error(e) }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-display font-medium glow-gold inline-block">Staff Fulfillment Center</h1>
        <p className="text-gray-400 mt-2 font-light tracking-wide">Manage and fulfill active orders</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-gold animate-pulse">Loading orders...</div>
          ) : orders.map((o, i) => (
            <motion.div 
              key={o.id} 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => viewOrder(o)}
              className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 ${selected?.id === o.id ? 'border-gold glow-border' : 'hover:border-white/20'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xl font-display text-white">{o.order_number}</div>
                  <div className="text-sm font-light text-gray-400 mt-1">{o.customer_name} • {new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${o.status === 'Delivered' ? 'bg-green-900/50 text-green-400' : 'bg-gold/20 text-gold'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && !loading && <div className="text-gray-400 font-light">No orders currently in queue.</div>}
        </div>

        <div className="relative">
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div 
                  key={selected.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <h2 className="text-2xl font-display font-medium">{selected.order_number}</h2>
                  <div className="text-sm font-light text-gray-400 mt-1">{selected.customer_name}</div>
                  <div className="text-sm font-light text-gray-400">{selected.email} • {selected.phone}</div>
                  
                  <div className="mt-8">
                    <h3 className="text-sm uppercase tracking-widest text-gold mb-4">Order Items</h3>
                    <ul className="space-y-3">
                      {items.map(it => (
                        <li key={it.id} className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="font-light">{it.name} <span className="text-gold ml-2">x{it.qty}</span></span>
                          <span className="font-medium">{formatPeso(it.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-sm uppercase tracking-widest text-gold mb-4">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button 
                          key={s} 
                          onClick={() => changeStatus(selected.id, s)} 
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${selected.status === s ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 rounded-2xl text-center text-gray-400 font-light border-dashed border-2 border-white/10">
                  Select an order from the queue to view details and process fulfillment.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
