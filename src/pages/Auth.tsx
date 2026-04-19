import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuthContext } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['buyer', 'seller', 'law_firm', 'tax_consultant'], { required_error: 'Please select your role' }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
})

const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// ---------------------------------------------------------------------------
// Role-based redirect helper
// ---------------------------------------------------------------------------

function useRedirectAfterAuth() {
  const navigate = useNavigate()

  return (role: string | null) => {
    switch (role) {
      case 'seller':
        navigate('/seller')
        break
      case 'law_firm':
      case 'tax_consultant':
        navigate('/partner')
        break
      case 'admin':
      case 'superadmin':
        navigate('/admin')
        break
      default:
        navigate('/dashboard')
    }
  }
}

// ---------------------------------------------------------------------------
// Brand logo component
// ---------------------------------------------------------------------------

function TzDalaliBrand() {
  return (
    <div className="flex items-center justify-center gap-1 mb-2">
      <span className="font-serif text-3xl font-bold tracking-tight text-primary">TZ</span>
      <span className="font-serif text-3xl font-bold tracking-tight text-gold">Dalali</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sign In Tab
// ---------------------------------------------------------------------------

function SignInTab({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { signIn } = useAuthContext()
  const { toast } = useToast()
  const redirectAfterAuth = useRedirectAfterAuth()
  const { role } = useAuthContext()
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = async (values: SignInFormValues) => {
    const { error } = await signIn(values.email, values.password)

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error,
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Welcome back!',
      description: 'You have successfully signed in.',
    })

    redirectAfterAuth(role)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast({
          title: 'Google sign in failed',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Google sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="pl-10"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
        />
        <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
          Remember me
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-border hover:bg-secondary"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Switch to register */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-gold hover:text-gold/80 font-medium underline-offset-2 hover:underline transition-colors"
        >
          Create one now
        </button>
      </p>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Create Account Tab
// ---------------------------------------------------------------------------

function CreateAccountTab({ onSuccess, defaultRole }: { onSuccess: () => void; defaultRole?: string }) {
  const { signUp } = useAuthContext()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: (defaultRole as any) ?? 'buyer', acceptTerms: undefined },
  })

  useEffect(() => {
    if (defaultRole) setValue('role', defaultRole as any)
  }, [defaultRole, setValue])

  const acceptTerms = watch('acceptTerms')
  const selectedRole = watch('role')

  const onSubmit = async (values: SignUpFormValues) => {
    const { error } = await signUp(values.email, values.password, values.fullName, values.role)

    if (error) {
      toast({
        title: 'Registration failed',
        description: error,
        variant: 'destructive',
      })
      return
    }

    reset()
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">
          Full name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className="pl-10"
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="pl-10"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Role selector */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground">I am a</Label>
        <Select
          value={selectedRole}
          onValueChange={(val) => setValue('role', val as 'buyer' | 'seller', { shouldValidate: true })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">Buyer — I'm looking to purchase property</SelectItem>
            <SelectItem value="seller">Seller / Property Owner — I want to list property</SelectItem>
            <SelectItem value="law_firm">Law Firm Partner — I provide legal services</SelectItem>
            <SelectItem value="tax_consultant">Tax Consultant Partner — I provide tax services</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-xs text-destructive mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Terms acceptance */}
      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="accept-terms"
            checked={!!acceptTerms}
            onCheckedChange={(checked) =>
              setValue('acceptTerms', checked ? true : (undefined as unknown as true), {
                shouldValidate: true,
              })
            }
            className="mt-0.5"
          />
          <Label htmlFor="accept-terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
            I agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Reset Password Tab
// ---------------------------------------------------------------------------

function ResetPasswordTab() {
  const { resetPassword } = useAuthContext()
  const { toast } = useToast()
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const { error } = await resetPassword(values.email)

    if (error) {
      toast({
        title: 'Reset failed',
        description: error,
        variant: 'destructive',
      })
      return
    }

    setSentEmail(values.email)
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <Mail className="h-7 w-7 text-gold" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-primary">Check your inbox</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent password reset instructions to{' '}
            <span className="font-medium text-foreground">{sentEmail}</span>.
            Check your spam folder if you don't see it within a few minutes.
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            setEmailSent(false)
            setSentEmail('')
          }}
        >
          Send again
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link…
          </>
        ) : (
          'Send Reset Link'
        )}
      </Button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Registration success banner
// ---------------------------------------------------------------------------

function RegistrationSuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-lg border border-gold/40 bg-gold/5 px-4 py-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
          <Mail className="h-4 w-4 text-gold" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Almost there — check your email</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We sent a confirmation link. Click it to activate your account, then sign in below.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
        onClick={onDismiss}
      >
        Got it — take me to Sign In
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Auth page
// ---------------------------------------------------------------------------

const Auth = () => {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'register' : 'signin'
  const initialRole = searchParams.get('role') ?? undefined

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'reset'>(initialMode)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true)
    setActiveTab('signin')
  }

  const handleDismissSuccess = () => {
    setRegistrationSuccess(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
      {/* Subtle background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--gold)/0.12), transparent)',
        }}
      />

      <div className="relative w-full max-w-md">
        <Card className="shadow-luxe border-border/60">
          <CardHeader className="space-y-1 pb-4 text-center">
            <TzDalaliBrand />
            {/* Gold divider */}
            <div className="flex items-center justify-center">
              <div className="h-px w-12 bg-gradient-gold" />
              <div className="mx-2 h-1 w-1 rounded-full bg-gold" />
              <div className="h-px w-12 bg-gradient-gold" />
            </div>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              {activeTab === 'signin' && 'Welcome back. Sign in to continue.'}
              {activeTab === 'register' && 'Join the global real estate community.'}
              {activeTab === 'reset' && 'Reset your account password.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Registration success banner shown on the sign-in tab */}
            {registrationSuccess && activeTab === 'signin' && (
              <div className="mb-5">
                <RegistrationSuccessBanner onDismiss={handleDismissSuccess} />
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as typeof activeTab)
                if (v !== 'signin') setRegistrationSuccess(false)
              }}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
                <TabsTrigger
                  value="signin"
                  className="text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Create Account
                </TabsTrigger>
                <TabsTrigger
                  value="reset"
                  className="text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Reset Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-0">
                <SignInTab onSwitchToRegister={() => setActiveTab('register')} />
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <CreateAccountTab onSuccess={handleRegistrationSuccess} defaultRole={initialRole} />
              </TabsContent>

              <TabsContent value="reset" className="mt-0">
                <ResetPasswordTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TzDalali. Global Real Estate, Simplified.
        </p>
      </div>
    </div>
  )
}

export default Auth
