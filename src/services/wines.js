import { supabase } from '../lib/supabase'

export async function listWines() {
  const { data, error } = await supabase.from('wines').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getWine(id) {
  const { data, error } = await supabase.from('wines').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createWine(payload) {
  const { error } = await supabase.from('wines').insert([payload])
  if (error) throw error
  return true
}

export async function updateWine(id, payload) {
  const { error } = await supabase.from('wines').update(payload).eq('id', id)
  if (error) throw error
  return true
}

export async function deleteWine(id) {
  const { error } = await supabase.from('wines').delete().eq('id', id)
  if (error) throw error
  return true
}
