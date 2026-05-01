-- CARS VERTICAL
create type car_body_type as enum ('sedan','suv','hatchback','coupe','convertible','wagon','van','pickup','truck','other');
create type car_fuel_type as enum ('petrol','diesel','electric','hybrid','lpg','cng','other');
create type car_transmission as enum ('automatic','manual','semi_automatic','other');
create type car_condition as enum ('new','used','certified_pre_owned');

create table cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete cascade,
  country_id uuid references countries(id),
  region_id uuid references regions(id),
  district_id uuid references districts(id),
  make text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  price_currency char(3) default 'USD',
  price_usd numeric,
  mileage integer,
  mileage_unit text default 'km',
  body_type car_body_type,
  fuel_type car_fuel_type,
  transmission car_transmission,
  condition car_condition,
  exterior_color text,
  interior_color text,
  engine_size text,
  vin text,
  description text,
  features jsonb default '[]',
  images jsonb default '[]',
  featured_image text,
  status listing_status default 'draft',
  is_featured boolean default false,
  is_verified boolean default false,
  views integer default 0,
  saves integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_cars_make on cars(make);
create index idx_cars_model on cars(model);
create index idx_cars_price on cars(price_usd);
create index idx_cars_status on cars(status);
create trigger set_updated_at_cars before update on cars for each row execute procedure set_updated_at();

-- SAVED CARS
create table saved_cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  car_id uuid references cars(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, car_id)
);

-- RLS for cars
alter table cars enable row level security;
alter table saved_cars enable row level security;

create policy "public_read_active_cars" on cars for select using (status = 'active');
create policy "owner_manages_cars" on cars for all using (auth.uid() = owner_id);
create policy "admin_all_cars" on cars for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));
create policy "own_saved_cars" on saved_cars for all using (auth.uid() = user_id);

-- EXPAND LOCATIONS
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, tzdalali_active)
values
  -- Africa (More)
  ('Nigeria', 'NG', 'NGA', '+234', '🇳🇬', 'Africa', 'NGN', '₦', 'Naira', 'English', true),
  ('South Africa', 'ZA', 'ZAF', '+27', '🇿🇦', 'Africa', 'ZAR', 'R', 'Rand', 'English', true),
  ('Egypt', 'EG', 'EGY', '+20', '🇪🇬', 'Africa', 'EGP', 'E£', 'Egyptian Pound', 'Arabic', true),
  ('Ghana', 'GH', 'GHA', '+233', '🇬🇭', 'Africa', 'GHS', 'GH₵', 'Cedi', 'English', true),
  ('Ethiopia', 'ET', 'ETH', '+251', '🇪🇹', 'Africa', 'ETB', 'Br', 'Birr', 'Amharic', true),
  -- Europe
  ('France', 'FR', 'FRA', '+33', '🇫🇷', 'Europe', 'EUR', '€', 'Euro', 'French', true),
  ('Germany', 'DE', 'DEU', '+49', '🇩🇪', 'Europe', 'EUR', '€', 'Euro', 'German', true),
  ('Italy', 'IT', 'ITA', '+39', '🇮🇹', 'Europe', 'EUR', '€', 'Euro', 'Italian', true),
  ('Spain', 'ES', 'ESP', '+34', '🇪🇸', 'Europe', 'EUR', '€', 'Euro', 'Spanish', true),
  -- Middle East
  ('Saudi Arabia', 'SA', 'SAU', '+966', '🇸🇦', 'Middle East', 'SAR', 'SR', 'Riyal', 'Arabic', true),
  ('Qatar', 'QA', 'QAT', '+974', '🇶🇦', 'Middle East', 'QAR', 'QR', 'Riyal', 'Arabic', true),
  -- Asia
  ('China', 'CN', 'CHN', '+86', '🇨🇳', 'Asia', 'CNY', '¥', 'Yuan', 'Chinese', true),
  ('India', 'IN', 'IND', '+91', '🇮🇳', 'Asia', 'INR', '₹', 'Rupee', 'Hindi', true),
  ('Japan', 'JP', 'JPN', '+81', '🇯🇵', 'Asia', 'JPY', '¥', 'Yen', 'Japanese', true),
  ('Malaysia', 'MY', 'MYS', '+60', '🇲🇾', 'Asia', 'MYR', 'RM', 'Ringgit', 'Malay', true)
on conflict (iso_code) do nothing;
