import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { listWines, createWine, updateWine, deleteWine } from '../services/wines'
import { uploadImage } from '../services/storage'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { formatPeso } from '../lib/currency'

export default function ManageWines() {
  const loc = useLocation()
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', image: '', category_id: '', country_origin: '', bottle_size: '', vintage_year: '', stock: 0, price: 0, badge: '', rating: 0, featured: false })
  const dashboardPath = loc.pathname.startsWith('/staff') ? '/staff' : '/admin'

  async function load() {
    setLoading(true)
    try { const data = await listWines(); setWines(data) } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startEdit(w) {
    setEditing(w.id)
    setForm({ ...w })
  }

  function resetForm() { setEditing(null); setForm({ id: '', name: '', description: '', image: '', category_id: '', country_origin: '', bottle_size: '', vintage_year: '', stock: 0, price: 0, badge: '', rating: 0, featured: false }) }

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadImage('wines', file)
      setForm(f => ({ ...f, image: url }))
    } catch (err) { console.error(err) }
  }

  async function submit(e) {
    e.preventDefault()
    try {
      if (editing) {
        await updateWine(editing, form)
      } else {
        const id = 'wv-' + Date.now().toString().slice(-6)
        await createWine({ ...form, id })
      }
      await load()
      resetForm()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this wine?')) return
    await deleteWine(id)
    await load()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <Link to={dashboardPath} className="inline-flex items-center gap-2 text-sm font-light text-gray-400 hover:text-white transition-colors group mb-3">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-display font-medium glow-gold block">Menu Management</h1>
          <p className="text-gray-400 mt-2 font-light tracking-wide">Add, edit, or remove wines from the collection</p>
        </div>
        <div className="mt-4 md:mt-0 text-sm font-light text-gray-500 uppercase tracking-widest">{wines.length} Vintages</div>
      </motion.div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? <div className="text-gold animate-pulse">Loading menu...</div> : wines.map((w, i) => (
              <motion.div 
                key={w.id} 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:glow-border transition-all duration-300"
              >
                <div>
                  <div className="text-xl font-display text-white group-hover:text-gold transition-colors">{w.name}</div>
                  <div className="text-sm font-light text-gray-400 mt-2">{w.country_origin} • <span className="font-medium text-white">{formatPeso(w.price)}</span></div>
                  <div className="text-sm mt-3 flex items-center">
                    <span className="font-light text-gray-500 uppercase text-xs tracking-wider mr-2">Stock:</span>
                    <span className={`font-medium ${w.stock <= 5 ? 'text-rose-400 glow-border p-1 rounded bg-rose-500/10' : 'text-gray-300'}`}>{w.stock}</span>
                    {w.stock <= 5 && <span className="ml-3 text-xs bg-rose-600/20 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Low</span>}
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                  <button onClick={() => startEdit(w)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-medium transition-colors w-1/2">Edit</button>
                  <button onClick={() => handleDelete(w.id)} className="px-4 py-2 bg-rose-900/30 text-rose-300 hover:bg-rose-600 hover:text-white rounded-full text-xs font-medium transition-colors w-1/2">Remove</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-2xl sticky top-28">
            <h2 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4">{editing ? 'Edit Vintage' : 'Add Vintage'}</h2>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Wine Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-light" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Country</label>
                  <input value={form.country_origin} onChange={e => setForm({ ...form, country_origin: e.target.value })} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Size</label>
                  <input value={form.bottle_size} onChange={e => setForm({ ...form, bottle_size: e.target.value })} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" placeholder="e.g. 750ml" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Price (PHP)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
                <div>
                  <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
                </div>
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-1 block">Label / Image</label>
                <div className="relative overflow-hidden w-full h-32 bg-black/50 border border-dashed border-white/20 rounded-lg flex items-center justify-center group hover:border-gold transition-colors cursor-pointer">
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                  ) : (
                    <span className="text-sm font-light text-gray-500 group-hover:text-gold transition-colors">Click to upload</span>
                  )}
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button type="submit" className="w-full py-3 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]">Save Vintage</button>
                <button type="button" onClick={resetForm} className="w-full py-3 bg-transparent border border-white/20 hover:border-white text-white rounded-lg text-sm font-medium transition-all duration-300">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
