-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "pgcrypto";

-- ENUMS
create type user_role as enum ('buyer','seller','law_firm','tax_consultant','admin','superadmin');
create type property_type as enum ('apartment','house','villa','land','commercial','hotel','office','warehouse','other');
create type deal_type as enum ('sale','rent','lease');
create type listing_status as enum ('draft','pending_payment','pending_review','active','sold','rented','suspended','archived');
create type transaction_status as enum ('initiated','fee_paid','partner_assigned','due_diligence','contract_prep','tax_clearance','signing','escrow_funded','transferred','completed','cancelled','disputed');
create type partner_type as enum ('law_firm','tax_consultant','both');
create type partner_tier as enum ('associate','certified','elite');
create type partner_status as enum ('pending','active','suspended','rejected');
create type payment_method as enum ('stripe_card','mpesa','tigopesa','airtel_money','flutterwave','bank_transfer','unionpay','other');
create type payment_status as enum ('pending','completed','failed','refunded');
create type notification_type as enum ('deal_update','listing_approved','payment_confirmed','document_uploaded','partner_assigned','message','system','marketing');
create type doc_type as enum ('title_deed','sale_agreement','tax_clearance','id_copy','survey_report','valuation_report','legal_guarantee','other');
create type id_verification_status as enum ('pending','submitted','verified','rejected');
create type escrow_status as enum ('pending','funded','held','released','refunded');
create type zone_type as enum ('mainland','zanzibar','pemba','island','territory');

-- AUTO updated_at TRIGGER FUNCTION
create or replace function set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- COUNTRIES
create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  iso_code char(2) not null unique,
  iso3_code char(3),
  phone_code text,
  flag_emoji text,
  continent text,
  currency_code char(3),
  currency_symbol text,
  currency_name text,
  language_primary text,
  is_active boolean default true,
  property_tax_rate numeric default 0,
  stamp_duty_rate numeric default 0,
  capital_gains_rate numeric default 0,
  tzdalali_active boolean default false,
  tzdalali_launch_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger set_updated_at_countries before update on countries for each row execute procedure set_updated_at();

-- REGIONS
create table regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete cascade,
  name text not null,
  local_name text,
  capital text,
  zone zone_type,
  code text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(country_id, name)
);
create index idx_regions_country on regions(country_id);
create trigger set_updated_at_regions before update on regions for each row execute procedure set_updated_at();

-- DISTRICTS
create table districts (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references regions(id) on delete cascade,
  country_id uuid references countries(id) on delete cascade,
  name text not null,
  local_name text,
  council_type text,
  headquarters text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(region_id, name)
);
create index idx_districts_region on districts(region_id);
create index idx_districts_country on districts(country_id);
create trigger set_updated_at_districts before update on districts for each row execute procedure set_updated_at();

-- USERS
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  display_name text,
  phone text,
  phone_verified boolean default false,
  avatar_url text,
  role user_role default 'buyer',
  country_id uuid references countries(id),
  region_id uuid references regions(id),
  district_id uuid references districts(id),
  preferred_language text default 'en',
  preferred_currency char(3) default 'USD',
  id_verification_status id_verification_status default 'pending',
  id_verification_ref text,
  is_active boolean default true,
  last_login timestamptz,
  total_deals integer default 0,
  total_spent numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_users_role on users(role);
create index idx_users_country on users(country_id);
create trigger set_updated_at_users before update on users for each row execute procedure set_updated_at();

-- Trigger: auto-create user profile on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'buyer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PROPERTIES
create table properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete cascade,
  country_id uuid references countries(id),
  region_id uuid references regions(id),
  district_id uuid references districts(id),
  neighborhood text,
  full_address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  title text not null,
  title_sw text,
  description text,
  property_type property_type not null,
  deal_type deal_type not null,
  price numeric not null,
  price_currency char(3) default 'USD',
  price_usd numeric,
  price_negotiable boolean default false,
  price_period text,
  size_sqm numeric,
  land_size_acres numeric,
  bedrooms integer default 0,
  bathrooms integer default 0,
  year_built integer,
  floors integer,
  parking_spaces integer default 0,
  amenities jsonb default '[]',
  features jsonb default '[]',
  nearby_facilities jsonb default '[]',
  title_deed_type text,
  legal_status text,
  legal_notes text,
  featured_image text,
  images jsonb default '[]',
  virtual_tour_url text,
  video_url text,
  status listing_status default 'draft',
  is_featured boolean default false,
  is_verified boolean default false,
  views integer default 0,
  saves integer default 0,
  listing_fee_paid boolean default false,
  listing_fee_ref text,
  admin_notes text,
  rejection_reason text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_properties_country on properties(country_id);
create index idx_properties_region on properties(region_id);
create index idx_properties_status on properties(status);
create index idx_properties_deal_type on properties(deal_type);
create index idx_properties_type on properties(property_type);
create index idx_properties_price on properties(price_usd);
create index idx_properties_owner on properties(owner_id);
create index idx_properties_search on properties using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));
create trigger set_updated_at_properties before update on properties for each row execute procedure set_updated_at();

-- SAVED PROPERTIES
create table saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, property_id)
);

-- PARTNERS
create table partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  firm_name text not null,
  partner_type partner_type not null,
  tier partner_tier default 'associate',
  status partner_status default 'pending',
  primary_country_id uuid references countries(id),
  countries_covered jsonb default '[]',
  bar_registration_number text,
  tax_registration_number text,
  years_in_operation integer,
  website text,
  office_address text,
  description text,
  specializations jsonb default '[]',
  languages_spoken jsonb default '["en"]',
  logo_url text,
  documents_verified boolean default false,
  rating numeric(3,2) default 0,
  total_reviews integer default 0,
  total_deals integer default 0,
  total_revenue numeric default 0,
  is_founding_partner boolean default false,
  annual_fee_paid boolean default false,
  annual_fee_expiry timestamptz,
  commission_rate_law numeric default 3.0,
  commission_rate_tax numeric default 2.0,
  auto_assign boolean default true,
  response_time_hours integer default 24,
  tzdalali_verified_badge boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_partners_country on partners(primary_country_id);
create index idx_partners_type on partners(partner_type);
create index idx_partners_status on partners(status);
create trigger set_updated_at_partners before update on partners for each row execute procedure set_updated_at();

-- TRANSACTIONS
create table transactions (
  id uuid primary key default gen_random_uuid(),
  reference_code text unique default ('TZD-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  property_id uuid references properties(id),
  buyer_id uuid references users(id),
  seller_id uuid references users(id),
  law_firm_id uuid references partners(id),
  tax_consultant_id uuid references partners(id),
  deal_type deal_type not null,
  agreed_price numeric not null,
  agreed_currency char(3) default 'USD',
  agreed_price_usd numeric,
  agent_commission_pct numeric default 10,
  agent_commission_usd numeric,
  law_firm_fee_pct numeric default 3,
  law_firm_fee_usd numeric,
  tax_fee_pct numeric default 2,
  tax_fee_usd numeric,
  platform_fee_pct numeric default 5,
  platform_fee_usd numeric,
  escrow_status escrow_status default 'pending',
  escrow_ref text,
  escrow_funded_at timestamptz,
  escrow_released_at timestamptz,
  status transaction_status default 'initiated',
  current_step integer default 1,
  buyer_disclosure jsonb,
  source_of_funds text,
  intended_use text,
  advisory_acknowledged boolean default false,
  advisory_acknowledged_at timestamptz,
  contract_url text,
  notes text,
  admin_notes text,
  cancelled_reason text,
  dispute_reason text,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_transactions_property on transactions(property_id);
create index idx_transactions_buyer on transactions(buyer_id);
create index idx_transactions_seller on transactions(seller_id);
create index idx_transactions_status on transactions(status);
create index idx_transactions_ref on transactions(reference_code);
create trigger set_updated_at_transactions before update on transactions for each row execute procedure set_updated_at();

-- TRANSACTION STEPS
create table transaction_steps (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id) on delete cascade,
  step_number integer not null,
  step_name text not null,
  step_description text,
  assigned_to uuid references users(id),
  assigned_to_partner uuid references partners(id),
  status text default 'pending',
  due_date timestamptz,
  completed_at timestamptz,
  notes text,
  documents jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(transaction_id, step_number)
);
create index idx_steps_transaction on transaction_steps(transaction_id);
create trigger set_updated_at_steps before update on transaction_steps for each row execute procedure set_updated_at();

-- PAYMENTS
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  transaction_id uuid references transactions(id),
  property_id uuid references properties(id),
  payment_type text not null,
  amount numeric not null,
  currency char(3) not null,
  amount_usd numeric,
  method payment_method,
  status payment_status default 'pending',
  stripe_payment_intent text,
  flutterwave_ref text,
  mpesa_receipt text,
  external_ref text,
  metadata jsonb,
  failed_reason text,
  refunded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_payments_user on payments(user_id);
create index idx_payments_transaction on payments(transaction_id);
create index idx_payments_status on payments(status);
create trigger set_updated_at_payments before update on payments for each row execute procedure set_updated_at();

-- PARTNER PAYOUTS
create table partner_payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id),
  transaction_id uuid references transactions(id),
  amount_usd numeric not null,
  currency char(3) default 'USD',
  payout_type text,
  status payment_status default 'pending',
  payment_ref text,
  bank_account jsonb,
  processed_at timestamptz,
  created_at timestamptz default now()
);

-- DOCUMENTS
create table documents (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id) on delete cascade,
  property_id uuid references properties(id),
  uploaded_by uuid references users(id),
  partner_id uuid references partners(id),
  doc_type doc_type not null,
  file_name text,
  file_url text not null,
  file_size integer,
  is_encrypted boolean default true,
  signed boolean default false,
  signed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);
create index idx_documents_transaction on documents(transaction_id);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  body text not null,
  type notification_type,
  is_read boolean default false,
  action_url text,
  metadata jsonb,
  created_at timestamptz default now()
);
create index idx_notifications_user on notifications(user_id);
create index idx_notifications_unread on notifications(user_id, is_read) where is_read = false;

-- REVIEWS
create table reviews (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id),
  reviewer_id uuid references users(id),
  reviewee_id uuid references users(id),
  reviewee_partner_id uuid references partners(id),
  rating integer check(rating between 1 and 5),
  comment text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- EXCHANGE RATES
create table exchange_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency char(3) default 'USD',
  target_currency char(3) not null unique,
  rate numeric not null,
  updated_at timestamptz default now()
);

-- SEARCH ALERTS
create table search_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text,
  country_id uuid references countries(id),
  region_id uuid references regions(id),
  property_type property_type,
  deal_type deal_type,
  price_min numeric,
  price_max numeric,
  bedrooms_min integer,
  alert_channel text default 'email',
  is_active boolean default true,
  last_triggered_at timestamptz,
  created_at timestamptz default now()
);

-- ERROR LOGS
create table tzdalali_error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text,
  error_message text,
  stack_trace text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- CONSENT RECORDS
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  consent_type text not null,
  granted boolean not null,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- MATERIALIZED VIEW: platform stats
create materialized view tzdalali_platform_stats as
select
  (select count(*) from properties where status = 'active') as active_listings,
  (select count(distinct country_id) from properties where status = 'active') as active_countries,
  (select count(*) from partners where status = 'active') as active_partners,
  (select count(*) from transactions where status not in ('cancelled','completed')) as deals_in_progress,
  (select coalesce(sum(agreed_price_usd),0) from transactions where escrow_status = 'held') as escrow_total_usd,
  (select coalesce(sum(platform_fee_usd),0) from transactions where status = 'completed') as total_revenue_usd,
  (select count(*) from users) as total_users,
  (select count(*) from transactions where status = 'completed') as completed_deals,
  now() as refreshed_at;

-- ROW LEVEL SECURITY
alter table users enable row level security;
alter table properties enable row level security;
alter table transactions enable row level security;
alter table partners enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;
alter table payments enable row level security;
alter table saved_properties enable row level security;
alter table reviews enable row level security;
alter table search_alerts enable row level security;
alter table countries enable row level security;
alter table regions enable row level security;
alter table districts enable row level security;
alter table partner_payouts enable row level security;
alter table transaction_steps enable row level security;
alter table exchange_rates enable row level security;
alter table tzdalali_error_logs enable row level security;
alter table consent_records enable row level security;

-- RLS POLICIES

-- Users: own row + admin all
create policy "users_own" on users for all using (auth.uid() = id);
create policy "admin_all_users" on users for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- Properties: public read active, owner manages, admin all
create policy "public_read_active_properties" on properties for select using (status = 'active');
create policy "owner_manages_properties" on properties for all using (auth.uid() = owner_id);
create policy "admin_all_properties" on properties for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- Transactions: parties + admin
create policy "transaction_parties" on transactions for all using (
  auth.uid() = buyer_id or auth.uid() = seller_id
  or exists(select 1 from partners where id = law_firm_id and user_id = auth.uid())
  or exists(select 1 from partners where id = tax_consultant_id and user_id = auth.uid())
  or exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin'))
);

-- Transaction steps: same as transactions
create policy "transaction_steps_parties" on transaction_steps for all using (
  exists(select 1 from transactions t where t.id = transaction_id and (
    t.buyer_id = auth.uid() or t.seller_id = auth.uid()
    or exists(select 1 from users u where u.id = auth.uid() and u.role in ('admin','superadmin'))
  ))
);

-- Notifications: own only
create policy "own_notifications" on notifications for all using (auth.uid() = user_id);

-- Documents: transaction parties
create policy "document_parties" on documents for all using (
  exists(select 1 from transactions t where t.id = transaction_id and (
    t.buyer_id = auth.uid() or t.seller_id = auth.uid()
    or exists(select 1 from users u where u.id = auth.uid() and u.role in ('admin','superadmin'))
  ))
);

-- Geo tables: public read
create policy "public_read_countries" on countries for select using (true);
create policy "public_read_regions" on regions for select using (true);
create policy "public_read_districts" on districts for select using (true);
create policy "admin_write_countries" on countries for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));
create policy "admin_write_regions" on regions for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));
create policy "admin_write_districts" on districts for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- Saved properties: own
create policy "own_saves" on saved_properties for all using (auth.uid() = user_id);

-- Search alerts: own
create policy "own_alerts" on search_alerts for all using (auth.uid() = user_id);

-- Partners: public read active, own manage, admin all
create policy "public_read_partners" on partners for select using (status = 'active');
create policy "own_partner" on partners for all using (auth.uid() = user_id);
create policy "admin_all_partners" on partners for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- Payments: own + admin
create policy "own_payments" on payments for all using (auth.uid() = user_id or exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- Partner payouts: own partner + admin
create policy "partner_own_payouts" on partner_payouts for all using (
  exists(select 1 from partners where id = partner_id and user_id = auth.uid())
  or exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin'))
);

-- Exchange rates: public read
create policy "public_read_rates" on exchange_rates for select using (true);

-- Consent records: own
create policy "own_consent" on consent_records for all using (auth.uid() = user_id);

-- Error logs: admin only
create policy "admin_error_logs" on tzdalali_error_logs for all using (exists(select 1 from users where id = auth.uid() and role in ('admin','superadmin')));

-- FUNCTIONS
create or replace function tzdalali_calculate_commissions(
  price numeric,
  pct_agent numeric default 10,
  pct_law numeric default 3,
  pct_tax numeric default 2)
returns jsonb as $$
declare
  total_commission numeric := round(price * pct_agent / 100, 2);
  law_fee numeric := round(price * pct_law / 100, 2);
  tax_fee numeric := round(price * pct_tax / 100, 2);
  platform_fee numeric := total_commission - law_fee - tax_fee;
begin
  return jsonb_build_object(
    'total_commission', total_commission,
    'law_firm_fee', law_fee,
    'tax_fee', tax_fee,
    'platform_fee', platform_fee
  );
end;
$$ language plpgsql;

create or replace function tzdalali_find_partner(p_country_id uuid, p_type partner_type)
returns uuid as $$
declare partner_id uuid;
begin
  select id into partner_id from partners
  where status = 'active'
    and (primary_country_id = p_country_id or p_country_id::text = any(select jsonb_array_elements_text(countries_covered)))
    and (partner_type = p_type or partner_type = 'both')
    and auto_assign = true
  order by tier desc, tzdalali_verified_badge desc, rating desc, total_deals asc
  limit 1;
  return partner_id;
end;
$$ language plpgsql;

-- SEED: Tanzania country
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, property_tax_rate, stamp_duty_rate, capital_gains_rate, tzdalali_active, tzdalali_launch_date)
values ('Tanzania','TZ','TZA','+255','🇹🇿','Africa','TZS','TSh','Tanzanian Shilling','Swahili',1.0,4.0,10.0,true,'2024-01-01');

-- SEED: Kenya
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, property_tax_rate, stamp_duty_rate, capital_gains_rate, tzdalali_active)
values ('Kenya','KE','KEN','+254','🇰🇪','Africa','KES','KSh','Kenyan Shilling','Swahili',1.5,4.0,5.0,true);

-- SEED: United States
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, tzdalali_active)
values ('United States','US','USA','+1','🇺🇸','North America','USD','$','US Dollar','English',true);

-- SEED: United Kingdom
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, tzdalali_active)
values ('United Kingdom','GB','GBR','+44','🇬🇧','Europe','GBP','£','British Pound','English',true);

-- SEED: UAE
insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, tzdalali_active)
values ('United Arab Emirates','AE','ARE','+971','🇦🇪','Asia','AED','AED','UAE Dirham','Arabic',true);
