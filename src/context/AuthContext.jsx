import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const resolveRole = (sessionUser, profileRole) => {
    const metadataRole = sessionUser?.user_metadata?.role || sessionUser?.app_metadata?.role
    const devAdmin = localStorage.getItem('dev_admin')
    const email = (sessionUser?.email || '').toLowerCase()

    return profileRole || metadataRole || (devAdmin === email ? 'admin' : 'customer')
  }

  const checkUser = async (sessionUser) => {
    const devAdmin = localStorage.getItem('dev_admin')
    
    // If we have a real Supabase session
    if (sessionUser) {
      try {
        const sessionEmail = (sessionUser.email || '').toLowerCase()
        const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('email', sessionEmail).maybeSingle()
        setUser({ ...sessionUser, role: resolveRole(sessionUser, profile?.role), full_name: profile?.full_name })
      } catch (e) {
        const sessionEmail = (sessionUser.email || '').toLowerCase()
        setUser({ ...sessionUser, role: resolveRole(sessionUser) })
      }
      setAuthLoading(false)
      return
    }
    
    // If no real session, but dev_admin bypass is active, mock the session
    if (devAdmin) {
      setUser({ id: 'mock-dev-id', email: devAdmin, role: 'admin', full_name: 'Developer Bypass Admin' })
    } else {
      setUser(null)
    }
    setAuthLoading(false)
  }

  useEffect(() => {
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) checkUser(session?.user ?? null)
    })
    
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) checkUser(data.session?.user ?? null)
    })
    
    return () => {
      mounted = false;
      subscription?.unsubscribe()
    }
  }, [])

  const value = { user, authLoading }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
