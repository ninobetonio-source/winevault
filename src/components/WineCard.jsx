import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { formatPeso } from '../lib/currency'

export default function WineCard({ wine, onAdd }) {
  const [src, setSrc] = useState(wine.image)

  const [attempt, setAttempt] = useState(0)

  function handleError() {
    const next = attempt + 1
    setAttempt(next)
    if (next === 1) {
      const query = encodeURIComponent(wine.name || 'wine')
      setSrc(`https://source.unsplash.com/featured/?${query},wine`)
    } else {
      // Final fallback: embedded SVG placeholder (no external network required)
      const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#c0a86b' font-family='Arial' font-size='28'>${wine.name}</text></svg>`)
      setSrc(`data:image/svg+xml;charset=UTF-8,${svg}`)
    }
  }

  return (
    <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }} className="glass-card rounded-2xl p-5 group flex flex-col h-full cursor-pointer hover:glow-border">
      <div className="relative overflow-hidden rounded-xl h-64 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-shadow">
        <motion.img 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7 }}
          src={src} 
          onError={handleError} 
          alt={wine.name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {wine.badge && <span className="absolute top-3 left-3 bg-burgundy/90 backdrop-blur border border-gold/30 text-gold px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl z-10">{wine.badge}</span>}
      </div>
      <div className="mt-5 flex-1 flex flex-col relative z-10">
        <h3 className="text-xl font-display font-medium leading-tight group-hover:text-gold transition-colors">{wine.name}</h3>
        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase font-light">
          {wine.country_origin} • {wine.bottle_size} • {wine.vintage_year}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FiStar className="text-gold fill-gold/20" />
            <span className="text-sm font-medium">{wine.rating}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg font-light tracking-wide">{formatPeso(wine.price)}</div>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(wine, e.currentTarget); }} 
              className="bg-white/10 hover:bg-gold hover:text-black border border-white/10 hover:border-gold px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>  )
}
