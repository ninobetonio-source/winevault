-- PostgreSQL schema for WineVault
-- Run in Supabase SQL editor

-- Enable extensions (run once)
create extension if not exists pgcrypto;

-- Profiles / users table (holds roles)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  role text default 'customer',
  created_at timestamptz default now()
);

create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text unique,
  image text
);
create table if not exists wines (
  id text primary key,
  name text not null,
  description text,
  image text,
  category_id int references categories(id) on delete set null,
  country_origin text,
  bottle_size text,
  alcohol_content text,
  vintage_year int,
  stock int default 0,
  price numeric(10,2) not null,
  badge text,
  rating numeric(2,1) default 0,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id serial primary key,
  order_number text unique,
  customer_name text,
  email text,
  phone text,
  address text,
  landmark text,
  delivery_date date,
  delivery_time text,
  notes text,
  payment_method text,
  status text default 'Pending',
  total numeric(10,2),
  created_at timestamptz default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id int references orders(id) on delete cascade,
  wine_id text references wines(id) on delete set null,
  name text,
  qty int,
  price numeric(10,2)
);

create table if not exists inventory (
  id serial primary key,
  wine_id text references wines(id) on delete cascade,
  change int,
  note text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id serial primary key,
  order_id int references orders(id),
  amount numeric(10,2),
  method text,
  status text,
  provider_response jsonb,
  created_at timestamptz default now()
);

create table if not exists sales (
  id serial primary key,
  wine_id text,
  qty int,
  revenue numeric(12,2),
  day date
);

create table if not exists notifications (
  id serial primary key,
  title text,
  body text,
  meta jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists banners (
  id serial primary key,
  title text,
  image text,
  link text,
  active boolean default true
);

-- Utility: generate an order number server-side
create or replace function generate_order_number() returns text as $$
begin
  return 'WV' || to_char(now(), 'YYMMDDHH24MISS') || '-' || substring(md5(random()::text) from 1 for 4);
end;
$$ language plpgsql stable;

-- Trigger to populate order_number if not provided
create or replace function orders_before_insert() returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_order_number on orders;
create trigger orders_set_order_number before insert on orders for each row execute function orders_before_insert();

-- Row Level Security (RLS) policies
-- Enable RLS where appropriate
alter table profiles enable row level security;
alter table orders enable row level security;
alter table wines enable row level security;

-- Profiles: allow users to select/update their own profile, admins can manage
create policy profiles_select_self_or_admin on profiles
  for select using (
    (auth.jwt() ->> 'email') = email or exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role = 'admin')
  );

create policy profiles_update_self_or_admin on profiles
  for update using (
    (auth.jwt() ->> 'email') = email or exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role = 'admin')
  ) with check (true);

-- Allow admins to insert profiles (so admin UI can create staff/admin)
-- Allow admins to insert profiles (so admin UI can create staff/admin)
-- Also allow users to create their own profile when signing up (self-register).
drop policy if exists profiles_insert_admin on profiles;
create policy profiles_insert_admin on profiles
  for insert with check (
    (
      (auth.jwt() ->> 'email') = email
    )
    or
    (
      exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role = 'admin')
    )
  );

-- Orders: allow insert for authenticated (customers via anon can also insert if you allow), but management restricted to staff/admin
create policy orders_insert_authenticated on orders
  for insert using (auth.role() = 'authenticated') with check (true);

create policy orders_manage_by_staff_admin on orders
  for all using (
    exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role in ('admin','staff'))
  ) with check (
    exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role in ('admin','staff'))
  );

-- Wines: allow public read for website (allow select for anon), but restrict write to admin/staff
create policy wines_select_public on wines
  for select using (true);

create policy wines_manage_admin on wines
  for all using (
    exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role in ('admin','staff'))
  ) with check (
    exists (select 1 from profiles p where p.email = auth.jwt() ->> 'email' and p.role in ('admin','staff'))
  );

-- Notes:
-- - If you want customers (anonymous) to be able to place orders without sign-in, you can change `orders_insert_authenticated` to allow anon inserts (using `auth.role() = 'anon'` or `true`), but this has security implications.
-- - To create initial admin/staff users, insert rows in `profiles` with role='admin' or role='staff', and create corresponding Supabase Auth accounts via the Dashboard or using the Admin API.

-- Sample seed data (run manually in SQL editor):
-- insert into categories (name, slug, image) values
-- ('Red Wine', 'red-wine', ''), ('White Wine', 'white-wine', ''), ('Sparkling Wine', 'sparkling', ''), ('Champagne', 'champagne', ''), ('Rosé', 'rose', ''), ('Premium Collection', 'premium', '');

-- Example admin profile (uncomment and run after creating an auth user with the same email):
-- insert into profiles (email, full_name, role) values ('admin@example.com', 'Site Admin', 'admin');

-- End of schema

