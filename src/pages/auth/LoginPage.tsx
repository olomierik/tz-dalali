import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const { t } = useTranslation()
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  const handleSignIn = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    setError(null)
    const { error: err } = await signIn(email.trim(), password)
    setLoading(false)
    if (err) { setError(err); return }
    navigate('/dashboard', { replace: true })
  }

  const handleReset = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error: err } = await resetPassword(email.trim())
    setLoading(false)
    if (err) { setError(err); return }
    setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-400/20 border border-blue-400/40 mb-4">
            <Shield className="h-8 w-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.welcome')}</h1>
          <p className="text-blue-300 text-sm mt-1">Elohim Education Centre</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resetSent ? (
            <div className="text-center space-y-3 py-4">
              <p className="text-sm text-gray-700">Password reset link sent to <strong>{email}</strong>. Check your inbox.</p>
              <button onClick={() => { setResetSent(false); setForgotMode(false) }} className="text-sm text-blue-600 hover:underline">
                Back to sign in
              </button>
            </div>
          ) : forgotMode ? (
            <>
              <p className="text-sm text-gray-600">Enter your email and we'll send a reset link.</p>
              <div className="space-y-1">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  className="h-11"
                />
              </div>
              <Button onClick={handleReset} disabled={!email.trim() || loading} className="w-full h-11 bg-blue-700 hover:bg-blue-800">
                {loading ? t('common.loading') : 'Send reset link'}
              </Button>
              <button onClick={() => { setForgotMode(false); setError(null) }} className="text-sm text-gray-500 hover:text-gray-700 w-full text-center">
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  className="h-11"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                    className="h-11 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                disabled={!email.trim() || !password || loading}
                className="w-full h-11 bg-blue-700 hover:bg-blue-800"
              >
                {loading ? t('common.loading') : t('auth.signIn')}
              </Button>

              <button
                onClick={() => { setForgotMode(true); setError(null) }}
                className="text-sm text-blue-600 hover:underline w-full text-center"
              >
                {t('auth.forgotPassword')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
