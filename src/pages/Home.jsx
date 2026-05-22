import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { sampleWines } from '../lib/sampleData'
import WineCard from '../components/WineCard'
import { useCart } from '../context/CartContext'
import { flyToCart } from '../lib/cartFly'

export default function Home() {
  const { add } = useCart()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleAdd = (wine, sourceEl) => {
    flyToCart(sourceEl, wine.image)
    add(wine)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
        {/* Background elements for luminous effect */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burgundy/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[120px]" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-display font-semibold text-[3.25rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold glow-gold pb-4 animate-float">
              WineVault
            </h1>
            <p className="lead mt-6 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Curated luxury wines, delivered with discretion and exceptional elegance.
            </p>
            <div className="mt-6 max-w-xl mx-auto bg-black/30 border border-white/5 rounded-full px-6 py-3 glass">
              <p className="text-sm text-gray-200 font-light">Private allocations • Temperature-controlled shipping • Curated by expert sommeliers</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex items-center justify-center gap-6"
          >
            <Link to="/wines" className="elegant-btn">Explore Collection</Link>
            <Link to="/about" className="px-8 py-3 rounded-full border border-white/10 text-white font-display hover:bg-white/5 transition-all duration-300">Our Heritage</Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm font-light uppercase tracking-widest text-gold mb-2">Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-sm font-light uppercase tracking-widest text-gold mb-2">Curators Selection</h2>
            <h3 className="text-4xl md:text-6xl font-display font-semibold">Featured Wines</h3>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/wines" className="elegant-btn hidden md:inline-flex">View full menu</Link>
            <Link to="/wines" className="text-gold hover:text-white transition-colors pb-1 border-b border-gold/30 hover:border-white md:hidden">View full menu</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleWines.slice(0, 3).map((w, i) => (
            <motion.div 
              key={w.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
            >
              <WineCard wine={w} onAdd={handleAdd} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 z-0" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-sm font-light uppercase tracking-widest text-gold mb-4">Limited Allocation</h2>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-white mb-6 leading-tight">The 2012 Imperial Cuvee Reserve</h3>
            <p className="text-gray-300 font-light text-lg mb-8">Access to our most prestigious champagne is strictly limited. Pre-order now to secure your allocation for the upcoming holiday season.</p>
            <Link to="/wines/wv-008" className="elegant-btn inline-block">Secure Allocation</Link>
          </div>
          <div className="md:w-1/2">
            <img src="/wines/champagne.png" alt="Imperial Cuvee" className="w-full h-80 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" />
          </div>
        </div>
      </section>

      {/* Trending / Premium Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-light uppercase tracking-widest text-gold mb-2">Trending Now</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display text-white">Highly Sought After</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleWines.slice(3, 7).map((w, i) => (
             <motion.div 
               key={w.id}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.6 }}
             >
               <WineCard wine={w} onAdd={handleAdd} />
             </motion.div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 bg-black/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="text-3xl font-display text-center text-white mb-16">Acclaimed by Connoisseurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The presentation and provenance of the Bordeaux I received were absolutely impeccable. WineVault sets a new standard.", author: "Alexander P.", role: "Private Collector" },
              { text: "A truly luxurious digital experience backed by flawless logistics. My champagne arrived in temperature-controlled perfection.", author: "Sarah W.", role: "Event Director" },
              { text: "Their curatorial team possesses an extraordinary palate. Every recommendation has been a masterclass in terroir.", author: "James M.", role: "Sommelier" }
            ].map((review, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl flex flex-col justify-between">
                <p className="text-gray-300 font-light italic mb-8">&quot;{review.text}&quot;</p>
                <div>
                  <p className="text-gold font-medium">{review.author}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center relative z-10">
        <h3 className="text-4xl font-display font-medium text-white mb-4">Join The Menu Club</h3>
        <p className="text-gray-400 font-light text-lg mb-10">Gain access to private allocations, en primeur releases, and exclusive tasting events.</p>
        <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input type="email" placeholder="Enter your email address" className="p-4 rounded-full bg-white/5 border border-white/20 focus:border-gold outline-none text-white w-full sm:w-96 text-center sm:text-left font-light" />
          <button className="px-8 py-4 bg-gold text-black font-semibold rounded-full hover:bg-white transition-colors">Request Invitation</button>
        </form>
      </section>
    </div>
  )
}
