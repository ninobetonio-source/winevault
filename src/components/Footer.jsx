import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
  const loc = useLocation()
  if (loc.pathname.startsWith('/admin') || loc.pathname.startsWith('/staff')) return null

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link to="/" className="text-3xl font-display font-semibold tracking-wide flex items-center gap-2 mb-6">
            <span className="text-gold">Wine</span>Vault
          </Link>
          <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
            Curated luxury wines, delivered with discretion and exceptional elegance for the modern connoisseur.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"><FaFacebookF /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"><FaTwitter /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"><FaInstagram /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"><FaLinkedinIn /></a>
          </div>
        </div>

        <div>
           <h4 className="font-display font-medium text-white mb-6 uppercase tracking-widest text-sm">Collections</h4>
           <ul className="space-y-4 text-sm font-light text-gray-400">
             <li><Link to="/wines?cat=red" className="hover:text-gold transition-colors">Red Wines</Link></li>
             <li><Link to="/wines?cat=white" className="hover:text-gold transition-colors">White Wines</Link></li>
             <li><Link to="/wines?cat=sparkling" className="hover:text-gold transition-colors">Sparkling & Champagne</Link></li>
             <li><Link to="/wines?cat=rose" className="hover:text-gold transition-colors">Rosé</Link></li>
             <li><Link to="/wines?cat=premium" className="hover:text-gold transition-colors">Premium Vintage</Link></li>
           </ul>
        </div>

        <div>
           <h4 className="font-display font-medium text-white mb-6 uppercase tracking-widest text-sm">Assistance</h4>
           <ul className="space-y-4 text-sm font-light text-gray-400">
             <li><Link to="/track" className="hover:text-gold transition-colors">Track Order</Link></li>
             <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
             <li><Link to="/contact" className="hover:text-gold transition-colors">Concierge Support</Link></li>
             <li><Link to="/faq" className="hover:text-gold transition-colors">Delivery FAQs</Link></li>
             <li><Link to="/returns" className="hover:text-gold transition-colors">Returns Policy</Link></li>
           </ul>
        </div>

        <div>
           <h4 className="font-display font-medium text-white mb-6 uppercase tracking-widest text-sm">Newsletter</h4>
           <p className="text-gray-400 font-light text-sm mb-4">Subscribe for exclusive releases and private sommelier notes.</p>
           <form className="flex" onSubmit={e => e.preventDefault()}>
             <input type="email" placeholder="Your email address" className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-3 w-full text-sm font-light focus:outline-none focus:border-gold" />
             <button className="bg-gold text-black px-4 py-3 rounded-r-lg font-medium text-sm hover:bg-white transition-colors">Join</button>
           </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-gray-600">
        <p>&copy; {new Date().getFullYear()} WineVault Luxury. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
          <Link to="/login" className="hover:text-gold">Executive Portal</Link>
        </div>
      </div>
    </footer>
  )
}
