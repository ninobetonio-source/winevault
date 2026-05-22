import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { formatPeso } from '../lib/currency'

export default function Checkout() {
  const { items, clear } = useCart()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '', landmark: '', delivery_date: '', delivery_time: '', notes: '', payment_method: 'card' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  async function placeOrder(e) {
    e.preventDefault()
    if (items.length === 0) return toast.error('Cart is empty')
    
    setIsSubmitting(true)
    const order_number = 'WV' + Date.now().toString().slice(-6)
    
    try {
      const { data, error } = await supabase.from('orders').insert([{ 
        order_number, customer_name: form.full_name, email: form.email, 
        phone: form.phone, address: form.address, landmark: form.landmark, 
        delivery_date: form.delivery_date, delivery_time: form.delivery_time, 
        notes: form.notes, payment_method: form.payment_method, status: 'Pending', total 
      }]).select()
      
      if (error) throw error
      
      const orderId = data[0].id
      const itemsPayload = items.map(i => ({ order_id: orderId, name: i.name, qty: i.qty, price: i.price }))
      
      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload)
      if (itemsError) throw itemsError
      
      toast.success('Order placed successfully: ' + order_number)
      clear()
      setTimeout(() => {
        window.location.href = '/track'
      }, 2000)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-[80vh]">
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl font-display font-medium glow-gold inline-block">Secure Checkout</h1>
        <p className="text-gray-400 mt-2 font-light tracking-wide">Finalize your premium acquisition</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form id="checkout-form" onSubmit={placeOrder} className="glass-card p-8 rounded-3xl space-y-8">
            <div>
              <h2 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
                  <input required placeholder="E.g. James Bond" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
                  <input required type="email" placeholder="james@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Phone Number</label>
                  <input required placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4">Delivery & Logistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Delivery Address</label>
                  <input required placeholder="123 Luxury Lane, Wine City" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Nearest Landmark (Optional)</label>
                  <input placeholder="Near the Grand Plaza" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Requested Date</label>
                  <input required type="date" value={form.delivery_date} onChange={e => setForm({ ...form, delivery_date: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Requested Time</label>
                  <input required type="time" value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4">Payment & Special Instructions</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Payment Method</label>
                  <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light appearance-none text-white">
                    <option value="card">Credit Card (Encrypted)</option>
                    <option value="bank">Direct Bank Transfer</option>
                    <option value="cash">Concierge Pay on Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Concierge Notes / Gift Message</label>
                  <textarea placeholder="Any special arrangements required?" rows="4" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light resize-none" />
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl sticky top-28">
            <h2 className="text-xl font-display font-medium text-white mb-6 border-b border-white/10 pb-4">Acquisition Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(i => (
                <div key={i.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="w-10 h-10 object-contain drop-shadow-md" />
                    <div>
                      <div className="text-sm font-medium">{i.name}</div>
                      <div className="text-xs font-light text-gray-400">Qty: {i.qty}</div>
                    </div>
                  </div>
                  <div className="font-medium">{formatPeso(i.price * i.qty)}</div>
                </div>
              ))}
              {items.length === 0 && <div className="text-sm font-light text-gray-400 text-center py-4">No vintages selected.</div>}
            </div>

            <div className="space-y-4 mb-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-gray-400 font-light"><span>Subtotal</span><span>{formatPeso(total)}</span></div>
              <div className="flex justify-between text-gray-400 font-light"><span>Insured Delivery</span><span className="text-white">Complimentary</span></div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8 flex justify-between items-end">
              <span className="text-gray-300 font-medium">Final Total</span>
              <span className="text-3xl font-display font-medium text-gold glow-gold">{formatPeso(total)}</span>
            </div>
            
            <button 
              form="checkout-form" 
              type="submit" 
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 text-center bg-gold text-black rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? 'Processing Transaction...' : 'Complete Acquisition'}
            </button>
            <div className="mt-4 text-center text-xs text-gray-500 font-light tracking-wide flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500/80"></span> Secure SSL Encrypted
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
