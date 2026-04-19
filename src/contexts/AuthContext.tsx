import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  display_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  preferred_language: string
  preferred_currency: string
  id_verification_status: string
  country_id: string | null
  region_id: string | null
  district_id: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapSupabaseError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Invalid email or password. Please try again.'
  if (message.includes('Email not confirmed')) return 'Please verify your email address before signing in.'
  if (message.includes('User already registered')) return 'An account with this email already exists.'
  if (message.includes('Password should be at least')) return 'Password must be at least 6 characters long.'
  if (message.includes('Unable to validate email')) return 'Please enter a valid email address.'
  if (message.includes('Email rate limit exceeded')) return 'Too many attempts. Please wait a few minutes and try again.'
  if (message.includes('over_email_send_rate_limit')) return 'Too many emails sent. Please wait a few minutes and try again.'
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, display_name, phone, avatar_url, role, preferred_language, preferred_currency, id_verification_status, country_id, region_id, district_id')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('[AuthContext] fetchProfile error:', error.message)
        return null
      }
      return data as UserProfile | null
    } catch (err) {
      console.error('[AuthContext] fetchProfile unexpected error:', err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const data = await fetchProfile(user.id)
    setProfile(data)
  }, [user, fetchProfile])

  useEffect(() => {
    // Resolve the initial session before subscribing to changes so we only
    // set loading=false once and avoid a double-render flash.
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const data = await fetchProfile(currentUser.id)
        if (mounted) setProfile(data)
      }
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const data = await fetchProfile(currentUser.id)
        if (mounted) setProfile(data)
      } else {
        setProfile(null)
      }

      // Ensure loading is cleared on any auth event in case getSession hasn't resolved yet.
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

      if (error) {
        return { error: mapSupabaseError(error.message) }
      }

      if (data.user) {
        // Fire-and-forget: update last_login without blocking the sign-in flow.
        supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)
          .then(({ error: updateError }) => {
            if (updateError) {
              console.warn('[AuthContext] Failed to update last_login:', updateError.message)
            }
          })

        const profileData = await fetchProfile(data.user.id)
        setProfile(profileData)
      }

      return { error: null }
    } catch (err) {
      console.error('[AuthContext] signIn unexpected error:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }, [fetchProfile])

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    role: string = 'buyer',
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
        },
      })

      if (error) {
        return { error: mapSupabaseError(error.message) }
      }

      return { error: null }
    } catch (err) {
      console.error('[AuthContext] signUp unexpected error:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[AuthContext] signOut error:', err)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<{ error: string | null }> => {
    try {
      const redirectTo = `${window.location.origin}/auth?tab=reset-confirm`
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })

      if (error) {
        return { error: mapSupabaseError(error.message) }
      }

      return { error: null }
    } catch (err) {
      console.error('[AuthContext] resetPassword unexpected error:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }, [])

  const role = profile?.role ?? null

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signIn, signUp, signOut, resetPassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
