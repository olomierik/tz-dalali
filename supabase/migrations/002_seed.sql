-- =============================================================================
-- ShuleConnect: 002_seed.sql
-- Demo seed data for Elohim Education Centre — Tanga, Tanzania
-- Run AFTER 001_schema.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SCHOOL
-- ---------------------------------------------------------------------------
INSERT INTO schools (
  id,
  name,
  slug,
  country,
  city,
  address,
  phone,
  email,
  student_teacher_messaging
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Elohim Education Centre',
  'elohim-tanga',
  'Tanzania',
  'Tanga',
  'Plot 42, Mkwajuni Street, Tanga',
  '+255 27 264 0000',
  'info@elohim.ac.tz',
  false
)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- ALLOWED MESSAGE PAIRS
-- Defines which role combinations may open conversations in this school.
-- student-teacher messaging is off by default (matches the school record
-- above); update the 'enabled' column or toggle schools.student_teacher_messaging
-- to activate it.
-- ---------------------------------------------------------------------------
SELECT seed_allowed_message_pairs('a0000000-0000-0000-0000-000000000001');


-- ---------------------------------------------------------------------------
-- SAMPLE CLASSES
-- These are representative; adjust grade levels and academic year as needed.
-- ---------------------------------------------------------------------------
/*
INSERT INTO classes (id, school_id, name, grade_level, academic_year) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Standard 1 - Violet',  'Std 1', '2026'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Standard 2 - Indigo',  'Std 2', '2026'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Standard 3 - Blue',    'Std 3', '2026'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Standard 4 - Green',   'Std 4', '2026'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Standard 5 - Yellow',  'Std 5', '2026'),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Standard 6 - Orange',  'Std 6', '2026'),
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Standard 7 - Red',     'Std 7', '2026')
ON CONFLICT (id) DO NOTHING;
*/


-- ---------------------------------------------------------------------------
-- SAMPLE CALENDAR EVENTS
-- Requires at least one profile (admin) to be created first so created_by
-- can be set. Uncomment and replace the placeholder UUID once the first
-- admin account exists.
-- ---------------------------------------------------------------------------
/*
-- Replace 'ADMIN_PROFILE_UUID' with the real profile id after first-admin
-- provisioning (see instructions below).

INSERT INTO calendar_events (
  id, school_id, title, description, event_type, start_date, end_date, created_by
) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Term 1 Begins',
    'First day of Term 1, academic year 2026.',
    'event',
    '2026-01-13',
    '2026-01-13',
    'ADMIN_PROFILE_UUID'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'National Examination Week',
    'Standard 7 national examinations.',
    'exam',
    '2026-10-05',
    '2026-10-09',
    'ADMIN_PROFILE_UUID'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Uhuru Day (Public Holiday)',
    'Tanzania Independence Day — school closed.',
    'holiday',
    '2026-12-09',
    '2026-12-09',
    'ADMIN_PROFILE_UUID'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Parent–Teacher Meeting',
    'Mid-year progress review for all classes.',
    'meeting',
    '2026-05-22',
    '2026-05-22',
    'ADMIN_PROFILE_UUID'
  )
ON CONFLICT (id) DO NOTHING;
*/


-- =============================================================================
-- HOW TO PROVISION THE FIRST SCHOOL ADMIN
-- =============================================================================
--
-- Because this is a CLOSED network, there is no public sign-up. Follow these
-- steps in the Supabase dashboard to create the first administrator account:
--
-- STEP 1 — Create the auth user
--   Dashboard > Authentication > Users > "Add user"
--   Supply the admin's email address and a temporary password.
--   Copy the UUID that Supabase assigns (shown in the user list).
--
-- STEP 2 — Insert the profile
--   Open the SQL editor and run:
--
--   INSERT INTO profiles (id, school_id, full_name, email, role)
--   VALUES (
--     '<UUID from step 1>',
--     'a0000000-0000-0000-0000-000000000001',
--     'Your Admin Name',
--     'admin@elohim.ac.tz',
--     'school_admin'
--   );
--
-- STEP 3 — Send an invite email (optional but recommended)
--   Dashboard > Authentication > Users > select the user > "Send magic link"
--   This lets the admin set a permanent password without you sharing one.
--
-- STEP 4 — Uncomment the calendar event seed above
--   Replace 'ADMIN_PROFILE_UUID' with the UUID from step 1, then run the
--   INSERT block.
--
-- STEP 5 — Subsequent users (teachers, parents, students)
--   Use the invite_tokens table and the application's invite flow. The admin
--   creates tokens via the app; recipients open the invite link to register.
--   No direct Supabase dashboard access is needed for non-admin accounts.
--
-- NOTES:
--   * The 'super_admin' role bypasses school_id filtering and can manage
--     multiple schools. Only assign it to platform operators, not school staff.
--   * student_teacher_messaging is FALSE by default. Toggle it in the schools
--     table when/if the school opts in, and update allowed_message_pairs
--     accordingly.
--   * parental_consents is append-only (UPDATE/DELETE blocked by SQL rules).
--     Never delete consent records; record revocations by inserting a new row
--     with granted = false and revoked_at = now().
-- =============================================================================
