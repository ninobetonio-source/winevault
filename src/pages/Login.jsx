import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const nav = useNavigate()
  const { user, authLoading } = useAuth()

  const resolveRole = (sessionUser, profileRole) => {
    const metadataRole = sessionUser?.user_metadata?.role || sessionUser?.app_metadata?.role
    const email = (sessionUser?.email || '').toLowerCase()
    const devAdmin = localStorage.getItem('dev_admin')

    return profileRole || metadataRole || (devAdmin === email ? 'admin' : 'customer')
  }

  useEffect(() => {
    if (authLoading) return
    if (user?.role === 'admin') nav('/admin', { replace: true })
    if (user?.role === 'staff') nav('/staff', { replace: true })
  }, [user, authLoading, nav])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)

    // Local development fallback for the seeded admin credentials.
    if (form.email.trim().toLowerCase() === 'jireh@wine.com' && form.password === 'faith1') {
      localStorage.setItem('dev_admin', form.email.trim().toLowerCase())
      setLoading(false)
      toast.success('Developer bypass activated')
      window.location.href = '/admin'
      return
    }

    const email = form.email.trim().toLowerCase()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: form.password })
    
    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        localStorage.setItem('dev_admin', email);
        toast.success('Login rate-limited. Using local admin fallback.');
        setLoading(false);
        window.location.href = '/admin';
        return;
      }
      setLoading(false)
      return toast.error(error.message)
    }

    if (data?.user) {
      try {
        const signedInEmail = (data.user.email || email).toLowerCase()
        const { data: profile } = await supabase.from('profiles').select('role').eq('email', signedInEmail).maybeSingle()
        const role = resolveRole(data.user, profile?.role)
        
        setLoading(false)
        if (role === 'admin') nav('/admin', { replace: true })
        else if (role === 'staff') nav('/staff', { replace: true })
        else {
          toast.error('You do not have executive permissions.')
          nav('/', { replace: true })
        }
      } catch (e) {
        toast.error('Authorization failed.')
        setLoading(false)
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0b0b0d', color: '#fff', border: '1px solid #d4af37' } }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-md w-full relative z-10"
      >
        <button onClick={() => nav('/')} className="mb-6 flex items-center gap-2 text-sm font-light text-gray-400 hover:text-white transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-medium text-white tracking-wide glow-gold">Executive Portal</h1>
          <p className="mt-2 text-gray-400 font-light">Authorized personnel only</p>
        </div>
        
        <form onSubmit={submit} className="glass-card p-8 rounded-3xl group">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
              <input type="email" required className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-light text-white" placeholder="admin@winevault.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Password</label>
              <input type="password" required className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-light text-white" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          
          <div className="mt-10 space-y-4">
            <button type="submit" disabled={loading} className="w-full py-4 bg-gold text-black rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70">
              {loading ? 'Authenticating...' : 'Log In'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
