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
    // Call atomic RPC function on the DB to create order and related records
    try {
      const payload = { form, items, total }
      const { data, error } = await supabaseAdmin.rpc('create_order', payload)
      if (error) throw error
      return res.json(data)
    } catch (rpcErr) {
      console.error('create_order rpc error', rpcErr)
      return res.status(500).json({ error: rpcErr.message || String(rpcErr) })
    }
  } catch (err) {
    console.error('create-order error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}
