import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPeso } from '../lib/currency'

export default function Cart() {
  const { items, update, remove, clear } = useCart()

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-medium glow-gold inline-block">Your Menu Additions</h1>
          <p className="text-gray-400 mt-2 font-light tracking-wide">Review your selected vintages</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={() => { clear(); toast.success('Cart cleared', { icon: '🧹' }) }}
            className="text-sm font-light text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-2"
          >
            <FiX /> Clear Cart
          </button>
        )}
      </motion.div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center rounded-3xl mt-12 border-dashed border-2 border-white/10">
          <div className="text-2xl font-light text-gray-400 mb-6 font-display">Your cart is currently empty.</div>
          <Link to="/wines" className="px-8 py-4 bg-gold text-black rounded-full font-semibold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] inline-block">
            Explore Collection
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card flex p-6 rounded-2xl items-center gap-6 group hover:glow-border transition-all duration-300"
              >
                <div className="h-24 w-24 bg-gradient-to-b from-white/5 to-transparent rounded-xl flex items-center justify-center p-2 shrink-0">
                  <img src={item.image} alt={item.name} className="h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-display font-medium text-white group-hover:text-gold transition-colors">{item.name}</div>
                  <div className="text-sm font-light text-gray-400 mt-1">{formatPeso(item.price)} • {item.bottle_size}</div>
                </div>
                <div className="flex items-center gap-4 bg-black/50 p-1.5 rounded-full border border-white/10">
                  <button onClick={() => update(item.id, Math.max(1, item.qty - 1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-300 transition-colors">-</button>
                  <span className="w-4 text-center font-medium">{item.qty}</span>
                  <button onClick={() => update(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-300 transition-colors">+</button>
                </div>
                <button 
                  onClick={() => {
                    remove(item.id)
                    toast.success(`Removed ${item.name}`, { icon: '🗑️' })
                  }} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-900/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="relative">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl sticky top-28">
              <h2 className="text-xl font-display font-medium text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400 font-light"><span>Subtotal</span><span>{formatPeso(subtotal)}</span></div>
                <div className="flex justify-between text-gray-400 font-light"><span>Shipping</span><span className="text-white">Complimentary</span></div>
                <div className="flex justify-between text-gray-400 font-light"><span>Taxes</span><span>Calculated at checkout</span></div>
              </div>
              <div className="border-t border-white/10 pt-4 mb-8 flex justify-between items-end">
                <span className="text-gray-300 font-medium">Estimated Total</span>
                <span className="text-3xl font-display font-medium text-gold glow-gold">{formatPeso(subtotal)}</span>
              </div>
              <Link to="/checkout" className="block w-full py-4 text-center bg-gold text-black rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                Proceed to Checkout
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
