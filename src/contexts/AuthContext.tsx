import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { Profile, UserRole } from '@/types'
import i18n from '@/i18n'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: UserRole | null
  schoolId: string | null
  loading: boolean
  sendOtp: (contact: string, isEmail: boolean) => Promise<{ error: string | null }>
  verifyOtp: (contact: string, token: string, isEmail: boolean) => Promise<{ error: string | null }>
  useInviteToken: (token: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
  canMessage: (targetRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    return data as Profile | null
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await fetchProfile(user.id)
    setProfile(p)
    if (p?.language_pref) i18n.changeLanguage(p.language_pref)
  }, [user, fetchProfile])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id).then(p => {
          setProfile(p)
          if (p?.language_pref) i18n.changeLanguage(p.language_pref)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id).then(p => {
          setProfile(p)
          if (p?.language_pref) i18n.changeLanguage(p.language_pref)
        })
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const sendOtp = async (contact: string, isEmail: boolean): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOtp(
      isEmail
        ? { email: contact, options: { shouldCreateUser: false } }
        : { phone: contact, options: { shouldCreateUser: false } }
    )
    return { error: error?.message ?? null }
  }

  const verifyOtp = async (contact: string, token: string, isEmail: boolean): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.verifyOtp(
      isEmail
        ? { email: contact, token, type: 'email' as const }
        : { phone: contact, token, type: 'sms' as const }
    )
    return { error: error?.message ?? null }
  }

  const useInviteToken = async (token: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from('invite_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error || !data) return { error: 'Invalid or expired invite code.' }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const hasRole = (...roles: UserRole[]): boolean => {
    return !!profile && roles.includes(profile.role)
  }

  const canMessage = (targetRole: UserRole): boolean => {
    if (!profile) return false
    const myRole = profile.role

    // super_admin and school_admin can message anyone
    if (myRole === 'super_admin' || myRole === 'school_admin') return true

    const allowedPairs: [UserRole, UserRole][] = [
      ['teacher', 'parent'],
      ['parent', 'teacher'],
      ['parent', 'school_admin'],
      ['school_admin', 'parent'],
    ]

    return allowedPairs.some(([a, b]) => a === myRole && b === targetRole)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      loading,
      sendOtp, verifyOtp, useInviteToken,
      signOut, refreshProfile,
      hasRole, canMessage,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
