import { supabase } from '../lib/supabase'

export async function listUsers() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createUserProfile(profile) {
  const { data, error } = await supabase.from('profiles').insert([profile])
  if (error) throw error
  return data[0]
}

export async function deleteUserProfile(email) {
  const { error } = await supabase.from('profiles').delete().eq('email', email)
  if (error) throw error
  return true
}
