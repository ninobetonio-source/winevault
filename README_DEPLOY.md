# Deployment & Checkout Setup

Follow these steps to enable checkout and the atomic order flow in production.

1. Apply the SQL RPC to your Supabase database

- Open the Supabase dashboard for your project.
- Go to "SQL Editor" -> "New query".
- Copy the contents of `sql/rpc_create_order.sql` from this repo and run it.
- Verify the function `create_order(payload jsonb)` exists under "Database -> Functions".

2. Set environment variables for your deployment (Vercel / Netlify / etc.)

- `SUPABASE_URL` = your Supabase project URL (e.g. `https://xyz.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key (recommended for production)
  - This key bypasses Row Level Security (RLS). **Keep it secret** — do NOT commit it.
- If you don't have the service role key available temporarily, set:
  - `SUPABASE_ANON_KEY` or `VITE_SUPABASE_ANON_KEY` (dev-only fallback)

Vercel example:

- Open your Vercel project -> Settings -> Environment Variables.
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the "Production" environment and any preview/development environments you use.

3. Local testing (.env)

- Create a `.env` in the repo root (DO NOT commit it):

```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
# Optional for local secure tests:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. Confirm API & RPC integration

- The serverless API `api/create-order.js` calls the RPC `create_order` using the service role key when available; it will fallback to anon key only for short-term dev testing.
- If you get an error mentioning missing keys, ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in the deployment environment.

Security notes

- The `SUPABASE_SERVICE_ROLE_KEY` gives full access and bypasses RLS. Only store it in server-side secrets (Vercel Environment Variables). Never expose it to client code.
- The repo contains a dev fallback that uses the anon key to call the RPC — this is insecure and intended only to unblock testing. Remove or disable this fallback in production if you must enforce stricter security.

If you'd like, I can:

- Add a `deploy.sh` script that runs `psql`/`supabase` CLI to apply the SQL automatically (you'll need to provide DB credentials or use Supabase CLI), or
- Try a local smoke test POST to the API (I will need the deployment to be running and environment variables available).
