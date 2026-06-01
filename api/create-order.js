const { createClient } = require('@supabase/supabase-js')

// Load local .env when running locally (ignored in many serverless environments)
try { require('dotenv').config() } catch (e) {}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!SUPABASE_URL) {
    return res.status(500).json({ error: 'Missing SUPABASE_URL on server. Set SUPABASE_URL environment variable.' })
  }

  // For safety: operations that modify protected tables (stock, inventory, sales, payments)
  // require the Supabase service role key. If it's not present, return a clear error rather
  // than attempting operations with an anon key and causing RLS violations.
  if (!SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required on the server to create orders and update stock/inventory. Set this env var in your deployment.' })
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    const { form, items, total } = req.body || {}
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Insert order using service role (bypass RLS)
    const { data: orderData, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert([{ 
        customer_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        landmark: form.landmark,
        delivery_date: form.delivery_date,
        delivery_time: form.delivery_time,
        notes: form.notes,
        payment_method: form.payment_method,
        status: 'Pending',
        total
      }])
      .select()

    if (orderErr) throw orderErr
    const order = Array.isArray(orderData) ? orderData[0] : orderData

    const itemsPayload = items.map(i => ({ order_id: order.id, wine_id: i.id, name: i.name, qty: i.qty, price: i.price }))
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsPayload)
    if (itemsError) throw itemsError

    // --- Stock deduction & records ---
    try {
      const wineIds = items.map(i => i.id).filter(Boolean)
      let winesCurrent = []
      if (wineIds.length) {
        const { data: winesData, error: wineErr } = await supabaseAdmin.from('wines').select('id, stock').in('id', wineIds)
        if (wineErr) throw wineErr
        winesCurrent = winesData || []
      }

      // check stock availability
      for (const it of items) {
        if (!it.id) continue
        const wine = winesCurrent.find(w => w.id === it.id)
        if (wine && typeof wine.stock === 'number' && wine.stock < it.qty) {
          throw new Error(`Insufficient stock for ${it.name || it.id}`)
        }
      }

      // deduct stock, insert inventory and sales rows
      const today = new Date().toISOString().slice(0, 10)
      for (const it of items) {
        if (!it.id) continue
        const wine = winesCurrent.find(w => w.id === it.id)
        const newStock = (wine && typeof wine.stock === 'number') ? Math.max(0, wine.stock - it.qty) : null
        if (newStock !== null) {
          const { error: updErr } = await supabaseAdmin.from('wines').update({ stock: newStock }).eq('id', it.id)
          if (updErr) throw updErr

          // inventory record
          const { error: invErr } = await supabaseAdmin.from('inventory').insert([{ wine_id: it.id, change: -Math.abs(it.qty), note: `Sale/order ${order.id}` }])
          if (invErr) throw invErr

          // sales record
          const { error: salesErr } = await supabaseAdmin.from('sales').insert([{ wine_id: it.id, qty: it.qty, revenue: (it.price * it.qty), day: today }])
          if (salesErr) throw salesErr
        }
      }

      // create payment record (pending)
      const { error: payErr } = await supabaseAdmin.from('payments').insert([{ order_id: order.id, amount: total, method: form.payment_method, status: 'pending' }])
      if (payErr) throw payErr

      return res.json({ ok: true, order_number: order.order_number || null })
    } catch (postErr) {
      // attempt to rollback order and items if anything fails after order creation
      try {
        await supabaseAdmin.from('order_items').delete().eq('order_id', order.id)
        await supabaseAdmin.from('orders').delete().eq('id', order.id)
      } catch (rbErr) {
        console.error('rollback failed', rbErr)
      }
      throw postErr
    }
  } catch (err) {
    console.error('create-order error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}
