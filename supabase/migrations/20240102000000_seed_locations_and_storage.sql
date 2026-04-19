-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE: property-images bucket policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure bucket exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/webp','image/gif'];

-- Public read
drop policy if exists "Public can read property images" on storage.objects;
create policy "Public can read property images"
  on storage.objects for select
  to public
  using (bucket_id = 'property-images');

-- Authenticated upload (first folder segment must be the uploader's UID)
drop policy if exists "Sellers can upload property images" on storage.objects;
create policy "Sellers can upload property images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update own images
drop policy if exists "Sellers can update own property images" on storage.objects;
create policy "Sellers can update own property images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete own images
drop policy if exists "Sellers can delete own property images" on storage.objects;
create policy "Sellers can delete own property images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- EAST AFRICA COUNTRIES (full block)
-- ─────────────────────────────────────────────────────────────────────────────

insert into countries (name, iso_code, iso3_code, phone_code, flag_emoji, continent, currency_code, currency_symbol, currency_name, language_primary, tzdalali_active)
values
  ('Uganda',              'UG', 'UGA', '+256', '🇺🇬', 'Africa', 'UGX', 'USh',  'Ugandan Shilling',     'Swahili',  true),
  ('Rwanda',              'RW', 'RWA', '+250', '🇷🇼', 'Africa', 'RWF', 'Fr',   'Rwandan Franc',        'Kinyarwanda', true),
  ('Burundi',             'BI', 'BDI', '+257', '🇧🇮', 'Africa', 'BIF', 'Fr',   'Burundian Franc',      'Kirundi',  true),
  ('Ethiopia',            'ET', 'ETH', '+251', '🇪🇹', 'Africa', 'ETB', 'Br',   'Ethiopian Birr',       'Amharic',  true),
  ('South Sudan',         'SS', 'SSD', '+211', '🇸🇸', 'Africa', 'SSP', '£',    'South Sudanese Pound', 'English',  true),
  ('Somalia',             'SO', 'SOM', '+252', '🇸🇴', 'Africa', 'SOS', 'Sh',   'Somali Shilling',      'Somali',   true),
  ('Eritrea',             'ER', 'ERI', '+291', '🇪🇷', 'Africa', 'ERN', 'Nfk',  'Eritrean Nakfa',       'Tigrinya', true),
  ('Djibouti',            'DJ', 'DJI', '+253', '🇩🇯', 'Africa', 'DJF', 'Fr',   'Djiboutian Franc',     'French',   true),
  ('Mozambique',          'MZ', 'MOZ', '+258', '🇲🇿', 'Africa', 'MZN', 'MT',   'Mozambican Metical',   'Portuguese',true),
  ('Malawi',              'MW', 'MWI', '+265', '🇲🇼', 'Africa', 'MWK', 'MK',   'Malawian Kwacha',      'Chichewa', true),
  ('Zambia',              'ZM', 'ZMB', '+260', '🇿🇲', 'Africa', 'ZMW', 'ZK',   'Zambian Kwacha',       'English',  true),
  ('Zimbabwe',            'ZW', 'ZWE', '+263', '🇿🇼', 'Africa', 'ZWL', 'Z$',   'Zimbabwean Dollar',    'English',  true),
  ('Democratic Republic of Congo', 'CD', 'COD', '+243', '🇨🇩', 'Africa', 'CDF', 'Fr', 'Congolese Franc', 'French', true),
  ('Madagascar',          'MG', 'MDG', '+261', '🇲🇬', 'Africa', 'MGA', 'Ar',   'Malagasy Ariary',      'Malagasy', true),
  ('Comoros',             'KM', 'COM', '+269', '🇰🇲', 'Africa', 'KMF', 'Fr',   'Comorian Franc',       'Comorian', true),
  ('Seychelles',          'SC', 'SYC', '+248', '🇸🇨', 'Africa', 'SCR', '₨',    'Seychellois Rupee',    'French',   true),
  ('Mauritius',           'MU', 'MUS', '+230', '🇲🇺', 'Africa', 'MUR', '₨',    'Mauritian Rupee',      'English',  true)
on conflict (iso_code) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- TANZANIA REGIONS (26 + Zanzibar)
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  tz_id uuid;
begin
  select id into tz_id from countries where iso_code = 'TZ';

  insert into regions (country_id, name, code) values
    (tz_id, 'Arusha',       'AR'),
    (tz_id, 'Dar es Salaam','DS'),
    (tz_id, 'Dodoma',       'DO'),
    (tz_id, 'Geita',        'GT'),
    (tz_id, 'Iringa',       'IR'),
    (tz_id, 'Kagera',       'KA'),
    (tz_id, 'Katavi',       'KT'),
    (tz_id, 'Kigoma',       'KI'),
    (tz_id, 'Kilimanjaro',  'KJ'),
    (tz_id, 'Lindi',        'LN'),
    (tz_id, 'Manyara',      'MY'),
    (tz_id, 'Mara',         'MR'),
    (tz_id, 'Mbeya',        'MB'),
    (tz_id, 'Morogoro',     'MO'),
    (tz_id, 'Mtwara',       'MT'),
    (tz_id, 'Mwanza',       'MW'),
    (tz_id, 'Njombe',       'NJ'),
    (tz_id, 'Pemba North',  'PN'),
    (tz_id, 'Pemba South',  'PS'),
    (tz_id, 'Pwani',        'PW'),
    (tz_id, 'Rukwa',        'RK'),
    (tz_id, 'Ruvuma',       'RV'),
    (tz_id, 'Shinyanga',    'SH'),
    (tz_id, 'Simiyu',       'SM'),
    (tz_id, 'Singida',      'SI'),
    (tz_id, 'Songwe',       'SW'),
    (tz_id, 'Tabora',       'TB'),
    (tz_id, 'Tanga',        'TG'),
    (tz_id, 'Unguja North', 'UN'),
    (tz_id, 'Unguja South', 'US')
  on conflict (country_id, name) do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DAR ES SALAAM DISTRICTS
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  tz_id  uuid;
  dsr_id uuid;
begin
  select id into tz_id  from countries where iso_code = 'TZ';
  select id into dsr_id from regions   where country_id = tz_id and name = 'Dar es Salaam';

  insert into districts (country_id, region_id, name) values
    (tz_id, dsr_id, 'Ilala'),
    (tz_id, dsr_id, 'Kinondoni'),
    (tz_id, dsr_id, 'Temeke'),
    (tz_id, dsr_id, 'Ubungo'),
    (tz_id, dsr_id, 'Kigamboni')
  on conflict do nothing;
end $$;

-- ARUSHA districts
do $$
declare
  tz_id  uuid;
  r_id   uuid;
begin
  select id into tz_id from countries where iso_code = 'TZ';
  select id into r_id  from regions   where country_id = tz_id and name = 'Arusha';

  insert into districts (country_id, region_id, name) values
    (tz_id, r_id, 'Arusha City'),
    (tz_id, r_id, 'Arusha Rural'),
    (tz_id, r_id, 'Karatu'),
    (tz_id, r_id, 'Longido'),
    (tz_id, r_id, 'Meru'),
    (tz_id, r_id, 'Monduli'),
    (tz_id, r_id, 'Ngorongoro')
  on conflict do nothing;
end $$;

-- MWANZA districts
do $$
declare
  tz_id  uuid;
  r_id   uuid;
begin
  select id into tz_id from countries where iso_code = 'TZ';
  select id into r_id  from regions   where country_id = tz_id and name = 'Mwanza';

  insert into districts (country_id, region_id, name) values
    (tz_id, r_id, 'Ilemela'),
    (tz_id, r_id, 'Kwimba'),
    (tz_id, r_id, 'Magu'),
    (tz_id, r_id, 'Misungwi'),
    (tz_id, r_id, 'Nyamagana'),
    (tz_id, r_id, 'Sengerema'),
    (tz_id, r_id, 'Ukerewe')
  on conflict do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- KENYA REGIONS (counties)
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  ke_id uuid;
begin
  select id into ke_id from countries where iso_code = 'KE';

  insert into regions (country_id, name, code) values
    (ke_id, 'Nairobi',      'NAI'),
    (ke_id, 'Mombasa',      'MOM'),
    (ke_id, 'Kisumu',       'KSM'),
    (ke_id, 'Nakuru',       'NAK'),
    (ke_id, 'Eldoret / Uasin Gishu', 'ELD'),
    (ke_id, 'Kiambu',       'KMB'),
    (ke_id, 'Machakos',     'MKS'),
    (ke_id, 'Meru',         'MER'),
    (ke_id, 'Nyeri',        'NYR'),
    (ke_id, 'Kilifi',       'KLF'),
    (ke_id, 'Kakamega',     'KKM'),
    (ke_id, 'Kisii',        'KSI'),
    (ke_id, 'Bungoma',      'BNG'),
    (ke_id, 'Garissa',      'GRS'),
    (ke_id, 'Kwale',        'KWL'),
    (ke_id, 'Lamu',         'LMU'),
    (ke_id, 'Kitui',        'KTU'),
    (ke_id, 'Murang''a',    'MRG'),
    (ke_id, 'Embu',         'EMB'),
    (ke_id, 'Laikipia',     'LKP'),
    (ke_id, 'Nyandarua',    'NYN'),
    (ke_id, 'Tharaka-Nithi','THN'),
    (ke_id, 'Isiolo',       'ISL'),
    (ke_id, 'Marsabit',     'MBT'),
    (ke_id, 'Kajiado',      'KJD'),
    (ke_id, 'Makueni',      'MKN')
  on conflict (country_id, name) do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- UGANDA REGIONS
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  ug_id uuid;
begin
  select id into ug_id from countries where iso_code = 'UG';

  insert into regions (country_id, name, code) values
    (ug_id, 'Kampala',      'KLA'),
    (ug_id, 'Central',      'CEN'),
    (ug_id, 'Eastern',      'EAS'),
    (ug_id, 'Northern',     'NOR'),
    (ug_id, 'Western',      'WES'),
    (ug_id, 'Wakiso',       'WKS'),
    (ug_id, 'Jinja',        'JNJ'),
    (ug_id, 'Mbarara',      'MBR'),
    (ug_id, 'Gulu',         'GUL'),
    (ug_id, 'Lira',         'LIR')
  on conflict (country_id, name) do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RWANDA REGIONS
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  rw_id uuid;
begin
  select id into rw_id from countries where iso_code = 'RW';

  insert into regions (country_id, name, code) values
    (rw_id, 'Kigali City',  'KIG'),
    (rw_id, 'Northern',     'NOR'),
    (rw_id, 'Southern',     'SOU'),
    (rw_id, 'Eastern',      'EAS'),
    (rw_id, 'Western',      'WES')
  on conflict (country_id, name) do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- ETHIOPIA REGIONS
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  et_id uuid;
begin
  select id into et_id from countries where iso_code = 'ET';

  insert into regions (country_id, name, code) values
    (et_id, 'Addis Ababa',  'ADD'),
    (et_id, 'Oromia',       'ORM'),
    (et_id, 'Amhara',       'AMH'),
    (et_id, 'Tigray',       'TGY'),
    (et_id, 'SNNPR',        'SNN'),
    (et_id, 'Dire Dawa',    'DDW'),
    (et_id, 'Harari',       'HAR'),
    (et_id, 'Afar',         'AFR'),
    (et_id, 'Somali',       'SOM'),
    (et_id, 'Sidama',       'SID')
  on conflict (country_id, name) do nothing;
end $$;
