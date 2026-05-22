import React from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiGlobe, FiShield } from 'react-icons/fi'
import dev1 from '../components/images/092d04ec-2251-4c32-8ff2-e7eb0c87cb65.jpeg'
import dev2 from '../components/images/07c38fad-fa57-464e-92ba-c2a3c8b3dd6f.jpeg'
import { FiGithub, FiLinkedin } from 'react-icons/fi'

export default function About() {
  const values = [
    { icon: <FiGlobe size={28} />, title: 'Global Sourcing', desc: 'Directly imported from historic estates spanning Bordeaux to Napa Valley.' },
    { icon: <FiShield size={28} />, title: 'Discreet Delivery', desc: 'Temperature-controlled, secure transit with absolute discretion.' },
    { icon: <FiAward size={28} />, title: 'Curated Excellence', desc: 'Only the top 1% of vintages pass our rigorous sommelier evaluation.' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-burgundy/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-sm font-light uppercase tracking-widest text-gold mb-6">About Us</h1>
          <h2 className="text-5xl md:text-7xl font-display font-medium text-white mb-8 leading-tight">Mastering the Art of Fine Wine</h2>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            WineVault was founded entirely on the singular principle of granting exclusive access to the world&apos;s most precious and rare vintages. For discerning collectors, wine is more than a beverage—it is living history.
          </p>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="glass-card p-10 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="text-gold mb-6 bg-gold/10 p-5 rounded-full group-hover:scale-110 transition-transform duration-500">{v.icon}</div>
              <h3 className="text-2xl font-display font-medium mb-4 text-white group-hover:text-gold transition-colors">{v.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="mt-32 glass-card border border-gold/30 p-12 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-[shimmer_3s_infinite]" />
          <h3 className="text-3xl font-display font-medium text-white mb-4 relative z-10">Private Consultations</h3>
          <p className="text-gray-300 font-light mb-8 max-w-xl mx-auto relative z-10">
            For menu curation and bulk investment acquisitions, please contact our chief sommelier directly.
          </p>
          <a href="mailto:concierge@winevault.com" className="inline-block px-8 py-4 bg-gold text-black font-semibold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] relative z-10">
            concierge@winevault.com
          </a>
        </motion.div>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-display font-medium text-white mb-2">Developers</h3>
          <p className="text-gray-400 font-light mb-8">The people who built this site.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }} className="dev-card">
            <img src={dev1} alt="Gensel Concha" className="w-24 h-24 rounded-full object-cover border-2 border-gold" />
            <div>
              <h4 className="text-xl font-medium text-white">Gensel Concha</h4>
              <p className="text-gray-400 text-sm">Frontend Engineer</p>
              <p className="dev-bio">UI-focused frontend engineer crafting responsive, accessible React interfaces and delightful micro-interactions.</p>
              <div className="dev-social mt-4 flex items-center">
                <a href="#" aria-label="Gensel GitHub"><FiGithub size={16} /></a>
                <a href="#" aria-label="Gensel LinkedIn"><FiLinkedin size={16} /></a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }} className="dev-card">
            <img src={dev2} alt="April Jane Loquere" className="w-24 h-24 rounded-full object-cover border-2 border-gold" />
            <div>
              <h4 className="text-xl font-medium text-white">April Jane Loquere</h4>
              <p className="text-gray-400 text-sm">Backend Engineer</p>
              <p className="dev-bio">Backend developer specializing in APIs, data modeling, and serverless patterns for scalable, secure systems.</p>
              <div className="dev-social mt-4 flex items-center">
                <a href="#" aria-label="April GitHub"><FiGithub size={16} /></a>
                <a href="#" aria-label="April LinkedIn"><FiLinkedin size={16} /></a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
