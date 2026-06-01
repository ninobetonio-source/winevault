const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase configuration on server' })
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

    return res.json({ ok: true, order_number: order.order_number || null })
  } catch (err) {
    console.error('create-order error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}
