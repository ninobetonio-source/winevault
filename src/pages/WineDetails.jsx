import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { sampleWines } from '../lib/sampleData'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiStar, FiTruck, FiShield, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { flyToCart } from '../lib/cartFly'
import { formatPeso } from '../lib/currency'

export default function WineDetails() {
  const { id } = useParams()
  const [wine, setWine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { add } = useCart()

  useEffect(() => {
    async function load() {
      // simulate db fetch
      const found = sampleWines.find(w => w.id === id)
      if (found) {
        setWine(found)
      } else {
        const { data } = await supabase.from('wines').select('*').eq('id', id).maybeSingle()
        if (data) setWine(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-gold animate-pulse text-2xl font-display">Tasting notes loading...</div>
    if (!wine) return <div className="min-h-[80vh] flex items-center justify-center text-gray-400 font-light">Vintage not found in our menu.</div>

  const handleAdd = (e) => {
    flyToCart(e.currentTarget, wine.image)
    add(wine, qty)
      toast.success(`${qty}x ${wine.name} added to your menu.`)
  }

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-screen">
      
      <Link to="/wines" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors font-light text-sm mb-12">
          <FiChevronLeft /> Return to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Image Viewer */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative h-[60vh] md:h-[80vh] flex items-center justify-center glass-card rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <img src={wine.image} alt={wine.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {wine.badge && (
            <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-black/60 border border-gold/40 text-gold text-xs font-semibold tracking-widest rounded-full backdrop-blur-md">
              {wine.badge}
            </div>
          )}
        </motion.div>

        {/* Right: Wine Information */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gold mb-4">
            <span className="flex items-center text-sm font-medium"><FiStar className="mr-1 fill-current" /> {wine.rating}</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm font-light tracking-wide uppercase text-gray-400">{wine.country_origin}</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm font-light tracking-wide text-gray-400">{wine.vintage_year}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-medium text-white leading-tight mb-6">{wine.name}</h1>
          <p className="text-3xl font-display text-gold glow-gold mb-8">{formatPeso(wine.price)}</p>
          
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-10 border-b border-white/10 pb-10">
            {wine.description}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-xs font-light text-gray-500 uppercase tracking-widest mb-1">Category</p>
              <p className="text-white font-medium">{wine.category || wine.category_id}</p>
            </div>
            <div>
              <p className="text-xs font-light text-gray-500 uppercase tracking-widest mb-1">Bottle Size</p>
              <p className="text-white font-medium">{wine.bottle_size}</p>
            </div>
            {wine.alcohol_content && (
              <div>
                <p className="text-xs font-light text-gray-500 uppercase tracking-widest mb-1">ABV</p>
                <p className="text-white font-medium">{wine.alcohol_content}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-light text-gray-500 uppercase tracking-widest mb-1">Availability</p>
                <p className={wine.stock > 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>{wine.stock > 0 ? 'In Menu' : 'Out of Stock'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-14">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-6 h-full text-gray-400 hover:text-white transition-colors">-</button>
              <span className="w-8 text-center text-lg font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-6 h-full text-gray-400 hover:text-white transition-colors">+</button>
            </div>
            <button 
              onClick={handleAdd}
              disabled={wine.stock <= 0}
              className="flex-1 h-14 bg-gold text-black rounded-full font-semibold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
                Add to Menu
            </button>
            <button className="h-14 w-14 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:border-rose-400 transition-colors">
              <FiHeart />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-light text-gray-400">
              <FiTruck className="text-gold" />
              <span>Complimentary insured shipping on orders over {formatPeso(500)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-light text-gray-400">
              <FiShield className="text-gold" />
              <span>Verified authenticity and temperature-controlled provenance</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
