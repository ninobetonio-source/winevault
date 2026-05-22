import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sampleWines } from '../lib/sampleData'
import WineCard from '../components/WineCard'
import { useCart } from '../context/CartContext'
import toast, { Toaster } from 'react-hot-toast'
import { flyToCart } from '../lib/cartFly'

export default function Wines() {
  const { add } = useCart()
  const [filter, setFilter] = useState('All')

  const filteredWines = filter === 'All' ? sampleWines : sampleWines.filter(w => w.category.includes(filter))
  const categories = ['All', 'Red', 'White', 'Sparkling', 'Rosé']

  const handleAdd = (w, sourceEl) => {
    flyToCart(sourceEl, w.image)
    add(w)
    toast.success(`Allocated ${w.name} to your menu`, {
      style: { background: '#0b0b0d', color: '#fff', border: '1px solid #d4af37' }
    })
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <h1 className="text-sm font-light uppercase tracking-widest text-gold mb-4">Complete Collection</h1>
        <h2 className="text-5xl md:text-6xl font-display font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
          The Vault
        </h2>
        <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">Explore our exclusive selection of rare vintages, meticulously curated for the world's most discerning collectors.</p>
        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-full border text-sm tracking-wide transition-all duration-300 ${filter === c ? 'border-gold text-gold bg-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-white/20 text-gray-400 hover:border-white hover:text-white'}`}
            >
              {c === 'All' ? 'All Vintages' : c}
            </button>
          ))}
        </div>
      </motion.div>
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWines.map((w, i) => (
            <motion.div 
              key={w.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <WineCard wine={w} onAdd={handleAdd} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
