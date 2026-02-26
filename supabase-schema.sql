-- ============================================================
-- ZENTIVORA - Dog Grooming Appointment Scheduling App
-- Supabase SQL Schema (safe to re-run multiple times)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- SERVICES TABLE
-- ============================================================
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration integer not null,
  category text default 'grooming',
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

drop policy if exists "Services are viewable by everyone" on public.services;
create policy "Services are viewable by everyone"
  on public.services for select
  using (true);

-- ============================================================
-- GROOMERS TABLE
-- ============================================================
create table if not exists public.groomers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  bio text,
  experience_years integer default 0,
  rating numeric(3,2) default 5.0,
  speciality text,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.groomers enable row level security;

drop policy if exists "Groomers are viewable by everyone" on public.groomers;
create policy "Groomers are viewable by everyone"
  on public.groomers for select
  using (true);

-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_id uuid references public.services(id) not null,
  groomer_id uuid references public.groomers(id),
  appointment_date date not null,
  appointment_time time not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  pet_name text not null,
  pet_breed text,
  pet_age integer,
  notes text,
  total_price numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

drop policy if exists "Users can view own appointments" on public.appointments;
create policy "Users can view own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own appointments" on public.appointments;
create policy "Users can create own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own appointments" on public.appointments;
create policy "Users can update own appointments"
  on public.appointments for update
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED DATA: Services (skips duplicates)
-- ============================================================
insert into public.services (name, description, price, duration, category) values
  ('Basic Bath & Brush', 'Full bath with premium shampoo, blow dry, brush out, and ear cleaning.', 35.00, 60, 'bath'),
  ('Full Groom Package', 'Complete grooming: bath, haircut, nail trim, ear cleaning, and teeth brushing.', 65.00, 120, 'groom'),
  ('Puppy First Groom', 'Gentle introduction to grooming for puppies under 6 months.', 45.00, 90, 'puppy'),
  ('De-Shedding Treatment', 'Specialized treatment to reduce shedding up to 80%.', 55.00, 90, 'treatment'),
  ('Spa Package', 'Luxury spa: bath, deep conditioning, massage, pawdicure, and cologne.', 85.00, 150, 'spa'),
  ('Nail Trim & File', 'Quick nail trim and filing for comfort and safety.', 15.00, 20, 'nail'),
  ('Teeth Brushing', 'Professional teeth cleaning to maintain oral health.', 12.00, 15, 'dental'),
  ('Flea & Tick Treatment', 'Medicated bath to eliminate and prevent fleas and ticks.', 50.00, 75, 'treatment')
on conflict do nothing;

-- ============================================================
-- SEED DATA: Groomers (skips duplicates)
-- ============================================================
insert into public.groomers (name, bio, experience_years, rating, speciality) values
  ('Sarah Johnson', 'Certified master groomer with a passion for all breeds. Specializes in doodles and poodles.', 8, 4.9, 'Poodles & Doodles'),
  ('Mike Chen', 'Former vet technician turned groomer. Gentle with anxious dogs and senior pets.', 5, 4.8, 'Anxious & Senior Dogs'),
  ('Emma Rodriguez', 'Award-winning groomer specializing in Asian fusion styling and creative cuts.', 10, 4.9, 'Creative Styling'),
  ('David Kim', 'Expert in large breed grooming including Newfoundlands, St. Bernards, and Great Danes.', 7, 4.7, 'Large Breeds')
on conflict do nothing;
