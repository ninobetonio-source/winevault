# WineVault

Premium wine ecommerce and management platform scaffolded with React, Vite, Tailwind and Supabase.

Quick start:

1. Copy `.env.example` to `.env` and set Supabase vars.
2. Install dependencies: `npm install` or `pnpm install`.
3. Run dev: `npm run dev`.

Deploy to Vercel — set the same env vars in Vercel dashboard.

Supabase setup (quick)

1. Open your Supabase project and go to the SQL editor. Run the contents of `sql/schema.sql` to create tables, triggers, and RLS policies.
2. Create storage buckets: `wines`, `banners`, `categories` (in the Storage section). Set public or signed URLs per your security needs.
3. Add an admin user:
   - Create an Auth user (email/password) via the Supabase Auth UI or API.
   - Insert a matching `profiles` row with `role='admin'` using the SQL editor:
     `insert into profiles (email, full_name, role) values ('admin@example.com', 'Admin', 'admin');`
   - Alternatively, use the in-app **Create Admin Account** button on `/login` for local testing (it will attempt to insert `profiles` and fall back to a `dev_admin` local flag if RLS prevents direct insertion).
4. Seed categories and sample wines using the commented seed SQL in `sql/schema.sql` or via the Dashboard.

Notes

- For production, ensure RLS policies match your security model and remove the `dev_admin` local fallback.
- To enable anonymous customers to place orders without creating accounts, you may need to adjust the `orders_insert_authenticated` policy in the SQL (the schema file includes notes on this).
