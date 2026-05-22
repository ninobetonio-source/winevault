import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { FiUserPlus, FiShield, FiUser, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

export default function ManageUsers() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: '', full_name: '', password: '', role: 'staff' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setProfiles(data)
    setLoading(false)
  }

  async function createAccount(e) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const normalizedEmail = form.email.trim().toLowerCase()
      const fullName = form.full_name.trim()
      const password = form.password

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }

      // Use server-side provisioning endpoint to create auth user and profile
      const adminApi = import.meta.env.VITE_ADMIN_API || '/create-user'
      const res = await fetch(adminApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, full_name: fullName, role: form.role })
      })

      // If the endpoint isn't present on the server (dev server not running or wrong URL), give a clear error
      const ct = res.headers.get('content-type') || ''
      if (res.status === 404) {
        // Attempt a safe fallback: upsert profile locally so the admin can at least see the identity in the UI.
        // NOTE: this does NOT create an auth user (requires service role). Admin must run the provisioning server
        // or use the developer bypass to create a usable login account.
        await supabase.from('profiles').upsert({ email: normalizedEmail, full_name: fullName, role: form.role })
        toast.success(`Profile created locally for ${normalizedEmail}. Run provisioning server to create login.`)
        setForm({ email: '', full_name: '', password: '', role: 'staff' })
        setIsSubmitting(false)
        load()
        return
      }

      let payload = null
      if (ct.includes('application/json')) {
        try {
          payload = await res.json()
        } catch (err) {
          // ignore parse errors; payload stays null
        }
      } else if (ct.includes('text/plain') || ct.includes('text/html')) {
        // read text for debugging messages
        try { payload = { message: await res.text() } } catch (err) { payload = null }
      }

      if (!res.ok) {
        const msg = payload?.error || payload?.message || res.statusText || `Provisioning failed (${res.status})`
        throw new Error(msg)
      }

      toast.success(`${form.role.toUpperCase()} account created for ${normalizedEmail}. They can now log in.`)

      setForm({ email: '', full_name: '', password: '', role: 'staff' })
      load()
      // Return to admin dashboard after successful provisioning
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Failed to create account profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function removeUser(id) {
    if (!confirm('Revoke access for this profile?')) return
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success('Access revoked.')
      load()
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0b0b0d', color: '#fff', border: '1px solid #d4af37' } }} />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-light text-gray-400 hover:text-white transition-colors group mb-3">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-display font-medium glow-gold block">Identity & Access</h1>
          <p className="text-gray-400 mt-2 font-light tracking-wide">Manage internal staff and administrative privileges</p>
        </div>
        <div className="text-sm font-light text-gray-500 uppercase tracking-widest mt-4 md:mt-0">{profiles.length} Identities</div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="glass-card p-8 rounded-3xl sticky top-28">
            <h2 className="text-xl font-display font-medium text-gold mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <FiUserPlus /> Provision Account
            </h2>
            <form onSubmit={createAccount} className="space-y-5">
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
                <input required placeholder="E.g. Jane Doe" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Work Email</label>
                <input required type="email" placeholder="jane@winevault.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Temporary Password</label>
                <input required type="password" minLength={6} placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light" />
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2 block">Clearance Level</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 focus:border-gold outline-none transition-all font-light appearance-none text-white">
                  <option value="staff">Fulfillment Staff</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 py-4 text-center bg-gold text-black rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="text-gold animate-pulse text-lg">Querying identity matrix...</div>
          ) : profiles.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex items-center gap-5 w-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${p.role === 'admin' ? 'bg-rose-900/20 border-rose-500/50 text-rose-400' : p.role === 'staff' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  {p.role === 'admin' ? <FiShield size={20} /> : <FiUser size={20} />}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-display text-white">{p.full_name || 'Anonymous User'}</div>
                  <div className="text-sm font-light text-gray-400">{p.email}</div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${p.role === 'admin' ? 'bg-rose-900/50 text-rose-300' : p.role === 'staff' ? 'bg-gold/20 text-gold glow-gold' : 'bg-white/10 text-gray-400'}`}>
                    {p.role}
                  </span>
                  <div className="text-xs font-light text-gray-500 mt-2 hidden sm:block">Since {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <button onClick={() => removeUser(p.id)} className="w-10 h-10 ml-2 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:border-rose-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0">
                   <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
          {profiles.length === 0 && !loading && <div className="text-gray-400 font-light">No identities found.</div>}
        </div>
      </div>
    </div>
  )
}
