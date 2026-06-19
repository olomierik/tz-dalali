export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student'

export type ConsentStatus = 'pending_consent' | 'active' | 'suspended'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export type CalendarEventType = 'exam' | 'holiday' | 'meeting' | 'deadline' | 'event'

export type SubmissionStatus = 'submitted' | 'graded' | 'late'

export type MessagePairType = 'teacher_parent' | 'teacher_student' | 'parent_school'

export interface School {
  id: string
  name: string
  slug: string
  country: string
  city: string
  address: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  student_teacher_messaging: boolean
  created_at: string
}

export interface Profile {
  id: string
  school_id: string
  full_name: string
  phone: string | null
  email: string | null
  role: UserRole
  avatar_url: string | null
  language_pref: 'en' | 'sw'
  created_at: string
}

export interface Student {
  id: string
  school_id: string
  profile_id: string | null
  full_name: string
  date_of_birth: string | null
  gender: string | null
  consent_status: ConsentStatus
  enrollment_date: string
  student_number: string | null
  created_at: string
  profile?: Profile
}

export interface Guardian {
  id: string
  school_id: string
  profile_id: string | null
  full_name: string
  phone: string
  email: string | null
  relationship: string
  created_at: string
}

export interface StudentGuardian {
  id: string
  student_id: string
  guardian_id: string
  is_primary: boolean
  created_at: string
}

export interface ParentalConsent {
  id: string
  student_id: string
  guardian_id: string
  school_id: string
  version: number
  granted: boolean
  granted_at: string | null
  revoked_at: string | null
  consent_text: string
  ip_address: string | null
  created_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  grade_level: string | null
  academic_year: string
  created_at: string
  teacher_count?: number
  student_count?: number
}

export interface ClassTeacher {
  id: string
  class_id: string
  teacher_id: string
  is_primary: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  class_id: string
  student_id: string
  enrolled_at: string
  status: 'active' | 'withdrawn'
}

export interface Announcement {
  id: string
  school_id: string
  class_id: string | null
  author_id: string
  title: string
  body: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  author?: Profile
  class?: Class | null
}

export interface Assignment {
  id: string
  school_id: string
  class_id: string
  teacher_id: string
  title: string
  instructions: string | null
  due_date: string
  max_score: number
  created_at: string
  updated_at: string
  class?: Class
  teacher?: Profile
  submission?: Submission
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content: string | null
  file_url: string | null
  submitted_at: string
  status: SubmissionStatus
  score: number | null
  feedback: string | null
  graded_at: string | null
  graded_by: string | null
}

export interface AttendanceRecord {
  id: string
  school_id: string
  class_id: string
  student_id: string
  teacher_id: string
  date: string
  status: AttendanceStatus
  note: string | null
  created_at: string
  student?: Student
}

export interface CalendarEvent {
  id: string
  school_id: string
  class_id: string | null
  title: string
  description: string | null
  event_type: CalendarEventType
  start_date: string
  end_date: string | null
  created_by: string
  created_at: string
}

export interface Conversation {
  id: string
  school_id: string
  subject: string | null
  created_at: string
  updated_at: string
  last_message?: Message
  participants?: ConversationParticipant[]
  unread_count?: number
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  profile_id: string
  last_read_at: string | null
  profile?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  sent_at: string
  read_at: string | null
  sender?: Profile
}

export interface AllowedMessagePair {
  id: string
  school_id: string
  pair_type: MessagePairType
  role_a: UserRole
  role_b: UserRole
  enabled: boolean
}

export interface AuditLog {
  id: string
  school_id: string
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
  actor?: Profile
}

export interface InviteToken {
  id: string
  school_id: string
  token: string
  role: UserRole
  email: string | null
  phone: string | null
  student_id: string | null
  used_at: string | null
  expires_at: string
  created_by: string
  created_at: string
}
