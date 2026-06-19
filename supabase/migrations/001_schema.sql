-- =============================================================================
-- ShuleConnect: 001_schema.sql
-- Elohim Education Centre — Tanga, Tanzania
-- Closed school network (no public registration).
-- PostgreSQL 14+ / Supabase
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- schools -----------------------------------------------------------------
CREATE TABLE schools (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                        text NOT NULL,
  slug                        text NOT NULL UNIQUE,
  country                     text NOT NULL DEFAULT 'Tanzania',
  city                        text,
  address                     text,
  phone                       text,
  email                       text,
  logo_url                    text,
  student_teacher_messaging   boolean NOT NULL DEFAULT false,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- profiles ----------------------------------------------------------------
-- One row per auth.users record; created by an invite flow, never by public
-- sign-up.
CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id       uuid REFERENCES schools(id) ON DELETE CASCADE,
  full_name       text NOT NULL,
  phone           text,
  email           text,
  role            text NOT NULL CHECK (role IN (
                    'super_admin', 'school_admin', 'teacher', 'parent', 'student'
                  )),
  avatar_url      text,
  language_pref   text NOT NULL DEFAULT 'en',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- students ----------------------------------------------------------------
CREATE TABLE students (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id        uuid REFERENCES profiles(id) ON DELETE SET NULL,
  full_name         text NOT NULL,
  date_of_birth     date,
  gender            text,
  consent_status    text NOT NULL DEFAULT 'pending_consent'
                      CHECK (consent_status IN ('pending_consent', 'active', 'suspended')),
  enrollment_date   date,
  student_number    text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- guardians ---------------------------------------------------------------
CREATE TABLE guardians (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  full_name   text NOT NULL,
  phone       text NOT NULL,
  email       text,
  relationship text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- student_guardians -------------------------------------------------------
CREATE TABLE student_guardians (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id   uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, guardian_id)
);

-- parental_consents -------------------------------------------------------
-- Append-only ledger; immutability enforced via rules below.
CREATE TABLE parental_consents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  guardian_id   uuid NOT NULL REFERENCES guardians(id) ON DELETE RESTRICT,
  school_id     uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  version       int NOT NULL DEFAULT 1,
  granted       boolean,
  granted_at    timestamptz,
  revoked_at    timestamptz,
  consent_text  text,
  ip_address    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- classes -----------------------------------------------------------------
CREATE TABLE classes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name            text NOT NULL,
  grade_level     text,
  academic_year   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- class_teachers ----------------------------------------------------------
CREATE TABLE class_teachers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, teacher_id)
);

-- enrollments -------------------------------------------------------------
CREATE TABLE enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  status      text NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'withdrawn')),
  UNIQUE (class_id, student_id)
);

-- announcements -----------------------------------------------------------
CREATE TABLE announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id    uuid REFERENCES classes(id) ON DELETE SET NULL,
  author_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  title       text NOT NULL,
  body        text NOT NULL,
  is_pinned   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- assignments -------------------------------------------------------------
CREATE TABLE assignments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id      uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  title         text NOT NULL,
  instructions  text,
  due_date      timestamptz,
  max_score     int NOT NULL DEFAULT 100,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- submissions -------------------------------------------------------------
CREATE TABLE submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         text,
  file_url        text,
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  status          text NOT NULL DEFAULT 'submitted'
                    CHECK (status IN ('submitted', 'graded', 'late')),
  score           int,
  feedback        text,
  graded_at       timestamptz,
  graded_by       uuid REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE (assignment_id, student_id)
);

-- attendance --------------------------------------------------------------
CREATE TABLE attendance (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id    uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  date        date NOT NULL,
  status      text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, student_id, date)
);

-- calendar_events ---------------------------------------------------------
CREATE TABLE calendar_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id    uuid REFERENCES classes(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  event_type  text NOT NULL CHECK (event_type IN ('exam', 'holiday', 'meeting', 'deadline', 'event')),
  start_date  date NOT NULL,
  end_date    date,
  created_by  uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- conversations -----------------------------------------------------------
CREATE TABLE conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- conversation_participants -----------------------------------------------
CREATE TABLE conversation_participants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at    timestamptz,
  UNIQUE (conversation_id, profile_id)
);

-- messages ----------------------------------------------------------------
CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  body            text NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  read_at         timestamptz
);

-- allowed_message_pairs ---------------------------------------------------
-- Defines which role combinations may open conversations.
CREATE TABLE allowed_message_pairs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  pair_type   text NOT NULL,
  role_a      text NOT NULL,
  role_b      text NOT NULL,
  enabled     boolean NOT NULL DEFAULT true,
  UNIQUE (school_id, role_a, role_b)
);

-- audit_logs --------------------------------------------------------------
-- Append-only; UPDATE/DELETE blocked via rules below.
CREATE TABLE audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     uuid REFERENCES schools(id) ON DELETE SET NULL,
  actor_id      uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action        text NOT NULL,
  entity_type   text,
  entity_id     uuid,
  details       jsonb NOT NULL DEFAULT '{}',
  ip_address    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- moderation_cases --------------------------------------------------------
CREATE TABLE moderation_cases (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  reporter_id           uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reported_entity_type  text,
  reported_entity_id    uuid,
  reason                text,
  status                text NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_by           uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- invite_tokens -----------------------------------------------------------
-- No public registration; all users join via invite token.
CREATE TABLE invite_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  token       text NOT NULL UNIQUE,
  role        text,
  email       text,
  phone       text,
  student_id  uuid REFERENCES students(id) ON DELETE SET NULL,
  used_at     timestamptz,
  expires_at  timestamptz NOT NULL,
  created_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX idx_profiles_school_id              ON profiles (school_id);
CREATE INDEX idx_students_school_id              ON students (school_id);
CREATE INDEX idx_students_profile_id             ON students (profile_id);
CREATE INDEX idx_guardians_school_id             ON guardians (school_id);
CREATE INDEX idx_guardians_profile_id            ON guardians (profile_id);
CREATE INDEX idx_student_guardians_student_id    ON student_guardians (student_id);
CREATE INDEX idx_student_guardians_guardian_id   ON student_guardians (guardian_id);
CREATE INDEX idx_parental_consents_student_id    ON parental_consents (student_id);
CREATE INDEX idx_classes_school_id               ON classes (school_id);
CREATE INDEX idx_enrollments_student_id          ON enrollments (student_id);
CREATE INDEX idx_enrollments_class_id            ON enrollments (class_id);
CREATE INDEX idx_announcements_school_id         ON announcements (school_id);
CREATE INDEX idx_announcements_class_id          ON announcements (class_id);
CREATE INDEX idx_assignments_class_id            ON assignments (class_id);
CREATE INDEX idx_submissions_assignment_id       ON submissions (assignment_id);
CREATE INDEX idx_submissions_student_id          ON submissions (student_id);
CREATE INDEX idx_attendance_class_date           ON attendance (class_id, date);
CREATE INDEX idx_attendance_student_id           ON attendance (student_id);
CREATE INDEX idx_calendar_events_school_id       ON calendar_events (school_id);
CREATE INDEX idx_calendar_events_dates           ON calendar_events (start_date, end_date);
CREATE INDEX idx_messages_conversation_id        ON messages (conversation_id);
CREATE INDEX idx_messages_sent_at               ON messages (sent_at);
CREATE INDEX idx_conv_participants_profile_id    ON conversation_participants (profile_id);
CREATE INDEX idx_audit_logs_school_id           ON audit_logs (school_id);
CREATE INDEX idx_audit_logs_actor_id            ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_created_at          ON audit_logs (created_at);
CREATE INDEX idx_moderation_cases_school_id     ON moderation_cases (school_id);
CREATE INDEX idx_invite_tokens_token            ON invite_tokens (token);
CREATE INDEX idx_invite_tokens_school_id        ON invite_tokens (school_id);


-- ---------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- ---------------------------------------------------------------------------

-- Returns the school_id of the currently authenticated user.
CREATE OR REPLACE FUNCTION my_school_id() RETURNS uuid AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Returns the role of the currently authenticated user.
CREATE OR REPLACE FUNCTION my_role() RETURNS text AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ---------------------------------------------------------------------------
-- AUDIT LOG IMMUTABILITY
-- ---------------------------------------------------------------------------
CREATE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

CREATE RULE parental_consents_no_update AS ON UPDATE TO parental_consents DO INSTEAD NOTHING;
CREATE RULE parental_consents_no_delete AS ON DELETE TO parental_consents DO INSTEAD NOTHING;


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE schools                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE students                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians         ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements             ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance                ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_message_pairs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_cases          ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_tokens             ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- RLS POLICIES: schools
-- ---------------------------------------------------------------------------
-- Authenticated users may read only their own school.
CREATE POLICY schools_select ON schools
  FOR SELECT TO authenticated
  USING (id = my_school_id());

-- super_admin can update any school; school_admin can update their own.
CREATE POLICY schools_update ON schools
  FOR UPDATE TO authenticated
  USING (
    my_role() = 'super_admin'
    OR (my_role() = 'school_admin' AND id = my_school_id())
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: profiles
-- ---------------------------------------------------------------------------
-- Any authenticated user can view profiles within the same school.
CREATE POLICY profiles_select ON profiles
  FOR SELECT TO authenticated
  USING (school_id = my_school_id());

-- Users can update only their own profile.
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Only admins can insert profiles (via invite flow).
CREATE POLICY profiles_insert ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    my_role() IN ('super_admin', 'school_admin')
    OR id = auth.uid()  -- user inserting their own profile after accepting invite
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: students
-- ---------------------------------------------------------------------------
-- Staff (super_admin, school_admin, teacher) in the same school can read.
-- Parents can see students linked to them via student_guardians.
-- Students can see their own record (where profile_id = auth.uid()).
CREATE POLICY students_select ON students
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR profile_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM student_guardians sg
          JOIN guardians g ON g.id = sg.guardian_id
        WHERE sg.student_id = students.id
          AND g.profile_id = auth.uid()
      )
    )
  );

-- Only admin/teacher can insert or update student records.
CREATE POLICY students_insert ON students
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY students_update ON students
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: guardians
-- ---------------------------------------------------------------------------
CREATE POLICY guardians_select ON guardians
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR profile_id = auth.uid()
    )
  );

CREATE POLICY guardians_insert ON guardians
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );

CREATE POLICY guardians_update ON guardians
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR profile_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: student_guardians
-- ---------------------------------------------------------------------------
CREATE POLICY student_guardians_select ON student_guardians
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_guardians.student_id
        AND s.school_id = my_school_id()
    )
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR EXISTS (
        SELECT 1 FROM guardians g
        WHERE g.id = student_guardians.guardian_id
          AND g.profile_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM students s
        WHERE s.id = student_guardians.student_id
          AND s.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY student_guardians_insert ON student_guardians
  FOR INSERT TO authenticated
  WITH CHECK (
    my_role() IN ('super_admin', 'school_admin')
    AND EXISTS (
      SELECT 1 FROM students s WHERE s.id = student_id AND s.school_id = my_school_id()
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: parental_consents
-- ---------------------------------------------------------------------------
-- Admins and the relevant guardian can read; INSERT is open to guardians.
-- No UPDATE/DELETE (blocked by rules).
CREATE POLICY parental_consents_select ON parental_consents
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR EXISTS (
        SELECT 1 FROM guardians g
        WHERE g.id = parental_consents.guardian_id
          AND g.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY parental_consents_insert ON parental_consents
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR EXISTS (
        SELECT 1 FROM guardians g
        WHERE g.id = guardian_id AND g.profile_id = auth.uid()
      )
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: classes
-- ---------------------------------------------------------------------------
CREATE POLICY classes_select ON classes
  FOR SELECT TO authenticated
  USING (school_id = my_school_id());

CREATE POLICY classes_write ON classes
  FOR ALL TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  )
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: class_teachers
-- ---------------------------------------------------------------------------
CREATE POLICY class_teachers_select ON class_teachers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
  );

CREATE POLICY class_teachers_write ON class_teachers
  FOR ALL TO authenticated
  USING (
    my_role() IN ('super_admin', 'school_admin')
    AND EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
  )
  WITH CHECK (
    my_role() IN ('super_admin', 'school_admin')
    AND EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: enrollments
-- ---------------------------------------------------------------------------
CREATE POLICY enrollments_select ON enrollments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR EXISTS (
        SELECT 1 FROM students s
        WHERE s.id = enrollments.student_id AND s.profile_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM students s
          JOIN student_guardians sg ON sg.student_id = s.id
          JOIN guardians g ON g.id = sg.guardian_id
        WHERE s.id = enrollments.student_id AND g.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY enrollments_write ON enrollments
  FOR ALL TO authenticated
  USING (
    my_role() IN ('super_admin', 'school_admin')
    AND EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
  )
  WITH CHECK (
    my_role() IN ('super_admin', 'school_admin')
    AND EXISTS (
      SELECT 1 FROM classes c WHERE c.id = class_id AND c.school_id = my_school_id()
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: announcements
-- ---------------------------------------------------------------------------
CREATE POLICY announcements_select ON announcements
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      class_id IS NULL  -- school-wide announcement
      OR my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR EXISTS (
        SELECT 1 FROM enrollments e
          JOIN students s ON s.id = e.student_id
        WHERE e.class_id = announcements.class_id
          AND s.profile_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM enrollments e
          JOIN students s ON s.id = e.student_id
          JOIN student_guardians sg ON sg.student_id = s.id
          JOIN guardians g ON g.id = sg.guardian_id
        WHERE e.class_id = announcements.class_id
          AND g.profile_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM class_teachers ct
        WHERE ct.class_id = announcements.class_id AND ct.teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY announcements_insert ON announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY announcements_update ON announcements
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR (my_role() = 'teacher' AND author_id = auth.uid())
    )
  );

CREATE POLICY announcements_delete ON announcements
  FOR DELETE TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR (my_role() = 'teacher' AND author_id = auth.uid())
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: assignments
-- ---------------------------------------------------------------------------
CREATE POLICY assignments_select ON assignments
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR EXISTS (
        SELECT 1 FROM enrollments e
          JOIN students s ON s.id = e.student_id
        WHERE e.class_id = assignments.class_id AND s.profile_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM enrollments e
          JOIN students s ON s.id = e.student_id
          JOIN student_guardians sg ON sg.student_id = s.id
          JOIN guardians g ON g.id = sg.guardian_id
        WHERE e.class_id = assignments.class_id AND g.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY assignments_insert ON assignments
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY assignments_update ON assignments
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR (my_role() = 'teacher' AND teacher_id = auth.uid())
    )
  );

CREATE POLICY assignments_delete ON assignments
  FOR DELETE TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin')
      OR (my_role() = 'teacher' AND teacher_id = auth.uid())
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: submissions
-- ---------------------------------------------------------------------------
-- Students can insert/update their own submission.
-- Teachers and admins can read all submissions for their school; admins/teachers
-- can update (grade) any submission in their school.
CREATE POLICY submissions_select ON submissions
  FOR SELECT TO authenticated
  USING (
    my_role() IN ('super_admin', 'school_admin', 'teacher')
    AND EXISTS (
      SELECT 1 FROM assignments a WHERE a.id = assignment_id AND a.school_id = my_school_id()
    )
    OR student_id = auth.uid()
  );

CREATE POLICY submissions_insert ON submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM assignments a
        JOIN enrollments e ON e.class_id = a.class_id
        JOIN students s ON s.id = e.student_id
      WHERE a.id = assignment_id AND s.profile_id = auth.uid()
    )
  );

CREATE POLICY submissions_update ON submissions
  FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      AND EXISTS (
        SELECT 1 FROM assignments a WHERE a.id = assignment_id AND a.school_id = my_school_id()
      )
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: attendance
-- ---------------------------------------------------------------------------
CREATE POLICY attendance_select ON attendance
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND (
      my_role() IN ('super_admin', 'school_admin', 'teacher')
      OR student_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM students s
          JOIN student_guardians sg ON sg.student_id = s.id
          JOIN guardians g ON g.id = sg.guardian_id
        WHERE s.profile_id = attendance.student_id AND g.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY attendance_insert ON attendance
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY attendance_update ON attendance
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: calendar_events
-- ---------------------------------------------------------------------------
CREATE POLICY calendar_events_select ON calendar_events
  FOR SELECT TO authenticated
  USING (school_id = my_school_id());

CREATE POLICY calendar_events_insert ON calendar_events
  FOR INSERT TO authenticated
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY calendar_events_update ON calendar_events
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin', 'teacher')
  );

CREATE POLICY calendar_events_delete ON calendar_events
  FOR DELETE TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: conversations
-- ---------------------------------------------------------------------------
-- Only participants may see a conversation.
CREATE POLICY conversations_select ON conversations
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversations.id
        AND cp.profile_id = auth.uid()
    )
  );

-- Any authenticated user in the school may create a conversation (the
-- application layer must verify allowed_message_pairs before calling insert).
CREATE POLICY conversations_insert ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (school_id = my_school_id());

-- Participants can update (e.g. to bump updated_at).
CREATE POLICY conversations_update ON conversations
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversations.id
        AND cp.profile_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: conversation_participants
-- ---------------------------------------------------------------------------
CREATE POLICY conv_participants_select ON conversation_participants
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id
        AND cp2.profile_id = auth.uid()
    )
  );

-- Only admins or the user themselves may be added as a participant.
CREATE POLICY conv_participants_insert ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    OR my_role() IN ('super_admin', 'school_admin')
  );

-- Users update their own last_read_at; admins can update any.
CREATE POLICY conv_participants_update ON conversation_participants
  FOR UPDATE TO authenticated
  USING (
    profile_id = auth.uid()
    OR my_role() IN ('super_admin', 'school_admin')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: messages
-- ---------------------------------------------------------------------------
-- Only conversation participants may read or send messages.
CREATE POLICY messages_select ON messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
        AND cp.profile_id = auth.uid()
    )
  );

CREATE POLICY messages_insert ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_id
        AND cp.profile_id = auth.uid()
    )
  );

-- No UPDATE on messages (immutable); admins may delete for moderation.
CREATE POLICY messages_delete ON messages
  FOR DELETE TO authenticated
  USING (my_role() IN ('super_admin', 'school_admin'));


-- ---------------------------------------------------------------------------
-- RLS POLICIES: allowed_message_pairs
-- ---------------------------------------------------------------------------
CREATE POLICY amp_select ON allowed_message_pairs
  FOR SELECT TO authenticated
  USING (school_id = my_school_id());

CREATE POLICY amp_write ON allowed_message_pairs
  FOR ALL TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  )
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: audit_logs
-- ---------------------------------------------------------------------------
-- Only admins may read; any authenticated user may insert (for client-side
-- audit events); UPDATE/DELETE are blocked by rules.
CREATE POLICY audit_logs_select ON audit_logs
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );

CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- RLS POLICIES: moderation_cases
-- ---------------------------------------------------------------------------
CREATE POLICY moderation_select ON moderation_cases
  FOR SELECT TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );

CREATE POLICY moderation_insert ON moderation_cases
  FOR INSERT TO authenticated
  WITH CHECK (school_id = my_school_id());

CREATE POLICY moderation_update ON moderation_cases
  FOR UPDATE TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );


-- ---------------------------------------------------------------------------
-- RLS POLICIES: invite_tokens
-- ---------------------------------------------------------------------------
-- Admins manage tokens; any unauthenticated or authenticated request can look
-- up a token by its value (needed for the invite-acceptance page).
CREATE POLICY invite_tokens_admin ON invite_tokens
  FOR ALL TO authenticated
  USING (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  )
  WITH CHECK (
    school_id = my_school_id()
    AND my_role() IN ('super_admin', 'school_admin')
  );

-- Allow token lookup by value (public, anon or authenticated) for acceptance
-- flow.  Expiry and used_at checks are enforced in application logic.
CREATE POLICY invite_tokens_redeem ON invite_tokens
  FOR SELECT
  USING (used_at IS NULL AND expires_at > now());


-- ---------------------------------------------------------------------------
-- SEED FUNCTION: allowed_message_pairs
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION seed_allowed_message_pairs(p_school_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO allowed_message_pairs (school_id, pair_type, role_a, role_b) VALUES
    (p_school_id, 'teacher_parent',  'teacher',      'parent'),
    (p_school_id, 'teacher_parent',  'parent',       'teacher'),
    (p_school_id, 'parent_school',   'parent',       'school_admin'),
    (p_school_id, 'parent_school',   'school_admin', 'parent'),
    (p_school_id, 'teacher_student', 'teacher',      'student'),
    (p_school_id, 'teacher_student', 'student',      'teacher')
  ON CONFLICT (school_id, role_a, role_b) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
