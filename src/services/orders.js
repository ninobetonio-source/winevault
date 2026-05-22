import { supabase } from '../lib/supabase'

export async function listOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrder(id) {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function listOrderItems(orderId) {
  const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId)
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
  return true
}

export async function createOrder(payload) {
  const { data, error } = await supabase.from('orders').insert([payload])
  if (error) throw error
  return data[0]
}
