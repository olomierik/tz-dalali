export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student'
export type ConsentStatus = 'pending_consent' | 'active' | 'suspended'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type CalendarEventType = 'exam' | 'holiday' | 'meeting' | 'deadline' | 'event'
export type SubmissionStatus = 'submitted' | 'graded' | 'late'
export type EnrollmentStatus = 'active' | 'withdrawn'

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: { id: string; name: string; slug: string; country: string; city: string; address: string | null; phone: string | null; email: string | null; logo_url: string | null; student_teacher_messaging: boolean; created_at: string }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      profiles: {
        Row: { id: string; school_id: string; full_name: string; phone: string | null; email: string | null; role: UserRole; avatar_url: string | null; language_pref: 'en' | 'sw'; created_at: string }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & { created_at?: string }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      students: {
        Row: { id: string; school_id: string; profile_id: string | null; full_name: string; date_of_birth: string | null; gender: string | null; consent_status: ConsentStatus; enrollment_date: string; student_number: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      guardians: {
        Row: { id: string; school_id: string; profile_id: string | null; full_name: string; phone: string; email: string | null; relationship: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['guardians']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['guardians']['Insert']>
      }
      student_guardians: {
        Row: { id: string; student_id: string; guardian_id: string; is_primary: boolean; created_at: string }
        Insert: Omit<Database['public']['Tables']['student_guardians']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['student_guardians']['Insert']>
      }
      parental_consents: {
        Row: { id: string; student_id: string; guardian_id: string; school_id: string; version: number; granted: boolean; granted_at: string | null; revoked_at: string | null; consent_text: string; ip_address: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['parental_consents']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['parental_consents']['Insert']>
      }
      classes: {
        Row: { id: string; school_id: string; name: string; grade_level: string | null; academic_year: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['classes']['Insert']>
      }
      class_teachers: {
        Row: { id: string; class_id: string; teacher_id: string; is_primary: boolean; created_at: string }
        Insert: Omit<Database['public']['Tables']['class_teachers']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['class_teachers']['Insert']>
      }
      enrollments: {
        Row: { id: string; class_id: string; student_id: string; enrolled_at: string; status: EnrollmentStatus }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at'> & { id?: string; enrolled_at?: string }
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }
      announcements: {
        Row: { id: string; school_id: string; class_id: string | null; author_id: string; title: string; body: string; is_pinned: boolean; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
      assignments: {
        Row: { id: string; school_id: string; class_id: string; teacher_id: string; title: string; instructions: string | null; due_date: string; max_score: number; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['assignments']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>
      }
      submissions: {
        Row: { id: string; assignment_id: string; student_id: string; content: string | null; file_url: string | null; submitted_at: string; status: SubmissionStatus; score: number | null; feedback: string | null; graded_at: string | null; graded_by: string | null }
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'submitted_at'> & { id?: string; submitted_at?: string }
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>
      }
      attendance: {
        Row: { id: string; school_id: string; class_id: string; student_id: string; teacher_id: string; date: string; status: AttendanceStatus; note: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      calendar_events: {
        Row: { id: string; school_id: string; class_id: string | null; title: string; description: string | null; event_type: CalendarEventType; start_date: string; end_date: string | null; created_by: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['calendar_events']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>
      }
      conversations: {
        Row: { id: string; school_id: string; subject: string | null; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      conversation_participants: {
        Row: { id: string; conversation_id: string; profile_id: string; last_read_at: string | null }
        Insert: Omit<Database['public']['Tables']['conversation_participants']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['conversation_participants']['Insert']>
      }
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; body: string; sent_at: string; read_at: string | null }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'sent_at'> & { id?: string; sent_at?: string }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      allowed_message_pairs: {
        Row: { id: string; school_id: string; pair_type: string; role_a: UserRole; role_b: UserRole; enabled: boolean }
        Insert: Omit<Database['public']['Tables']['allowed_message_pairs']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['allowed_message_pairs']['Insert']>
      }
      audit_logs: {
        Row: { id: string; school_id: string; actor_id: string | null; action: string; entity_type: string; entity_id: string | null; details: Json; ip_address: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: never
      }
      moderation_cases: {
        Row: { id: string; school_id: string; reporter_id: string; reported_entity_type: string; reported_entity_id: string; reason: string; status: 'open' | 'resolved' | 'dismissed'; resolved_by: string | null; resolved_at: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['moderation_cases']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['moderation_cases']['Insert']>
      }
      invite_tokens: {
        Row: { id: string; school_id: string; token: string; role: UserRole; email: string | null; phone: string | null; student_id: string | null; used_at: string | null; expires_at: string; created_by: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['invite_tokens']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['invite_tokens']['Insert']>
      }
    }
    Functions: {
      my_school_id: { Args: Record<never, never>; Returns: string }
      my_role: { Args: Record<never, never>; Returns: string }
      seed_allowed_message_pairs: { Args: { p_school_id: string }; Returns: void }
    }
  }
}
