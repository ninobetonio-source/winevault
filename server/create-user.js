/**
 * Simple admin provisioning endpoint.
 * Usage:
 * 1. Install deps: `npm install express @supabase/supabase-js dotenv`
 * 2. Create a .env in `server/` with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 3. Run: `node create-user.js` (or use PM2/systemd)
 *
 * This endpoint must be run server-side (never expose service role key to the browser).
 */

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const app = express()
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

app.post('/create-user', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body
    if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role required' })

    const normalizedEmail = String(email).trim().toLowerCase()

    // Create auth user (admin API)
    const { data: user, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      user_metadata: { full_name, role },
      email_confirm: true
    })

    if (createUserError) {
      // If user already exists, proceed to upsert profile
      if (!createUserError.message || !createUserError.message.toLowerCase().includes('already')) {
        return res.status(500).json({ error: createUserError.message || createUserError })
      }
    }

    // Insert profile row using service role (bypass RLS)
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .upsert({ email: normalizedEmail, full_name, role }, { onConflict: 'email' })

    if (profileErr) return res.status(500).json({ error: profileErr.message || profileErr })

    return res.json({ ok: true, user, profile })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || String(err) })
  }
})

const PORT = process.env.PORT || 54321
app.listen(PORT, () => console.log(`Admin provisioning server listening on port ${PORT}`))
