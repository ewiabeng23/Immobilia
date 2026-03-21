# 🏗️ Immobilia CM — Real Estate Platform for Cameroon

Bilingual (FR/EN) real estate listing platform. React + Vite frontend.
Free deployment: Vercel (frontend) + Supabase (DB/auth/storage) + Render (API).

## Quick Start
```bash
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev
```

## Deploy to Vercel
1. Push to GitHub
2. Import on vercel.com → Framework: Vite
3. Add env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
4. Deploy ✅

## Supabase Table
```sql
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null, listing_type text not null, property_type text not null,
  price bigint not null, city text not null, neighborhood text,
  bedrooms int, bathrooms int, area int, description text,
  amenities text[], images text[], verified boolean default false,
  featured boolean default false, agent_name text, agent_phone text,
  created_at timestamptz default now()
);
alter table properties enable row level security;
create policy "Public read" on properties for select using (true);
```

## Stack
- Frontend: React 18 + Vite + React Router v6
- Styling: CSS Modules (iOS glassmorphism, dark theme)
- i18n: Custom FR/EN context (no library)
- DB: Supabase (PostgreSQL)
- Hosting: Vercel (free) + Supabase (free) + Render (free)

## Pages
- / — Home: hero, search, featured listings, cities, how-it-works
- /listings — Filterable grid (type, city, price, bedrooms, keyword)
- /property/:id — Detail: gallery, agent WhatsApp/phone, similar listings
- /list — 3-step form to submit a property
- /about — Mission, values, contact

## Roadmap
- [ ] Wire form to Supabase insert
- [ ] Supabase Auth for agent accounts
- [ ] Image upload to Supabase Storage
- [ ] Map view (Leaflet + OpenStreetMap)
- [ ] Admin dashboard (approve/feature listings)
- [ ] MTN/Orange Money integration for premium listings
