import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Phone, Mail, ChevronRight, ChevronLeft, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { t } = useTranslation()
  const { sendOtp, verifyOtp, useInviteToken } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'phone' | 'email'>('phone')
  const [step, setStep] = useState<'contact' | 'otp' | 'token'>('contact')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async () => {
    if (!contact.trim()) return
    setLoading(true)
    setError(null)
    const { error: err } = await sendOtp(contact.trim(), mode === 'email')
    setLoading(false)
    if (err) { setError(err); return }
    setStep('otp')
  }

  const handleVerify = async () => {
    if (!otp.trim()) return
    setLoading(true)
    setError(null)
    const { error: err } = await verifyOtp(contact.trim(), otp.trim(), mode === 'email')
    setLoading(false)
    if (err) { setError(err); return }
    navigate('/dashboard', { replace: true })
  }

  const handleUseToken = async () => {
    if (!token.trim()) return
    setLoading(true)
    setError(null)
    const { error: err } = await useInviteToken(token.trim())
    setLoading(false)
    if (err) { setError(err); return }
    setStep('contact')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-400/20 border border-blue-400/40 mb-4">
            <Shield className="h-8 w-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.welcome')}</h1>
          <p className="text-blue-300 text-sm mt-1">{t('auth.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'contact' && (
            <>
              <Tabs value={mode} onValueChange={v => setMode(v as 'phone' | 'email')}>
                <TabsList className="w-full">
                  <TabsTrigger value="phone" className="flex-1 gap-2">
                    <Phone className="h-4 w-4" /> {t('auth.phone')}
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex-1 gap-2">
                    <Mail className="h-4 w-4" /> {t('auth.email')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label>{mode === 'phone' ? t('auth.phone') : t('auth.email')}</Label>
                <Input
                  type={mode === 'phone' ? 'tel' : 'email'}
                  placeholder={mode === 'phone' ? t('auth.phonePlaceholder') : t('auth.emailPlaceholder')}
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  className="h-12 text-base"
                />
              </div>

              <Button onClick={handleSendOtp} disabled={!contact.trim() || loading} className="w-full h-12 bg-blue-700 hover:bg-blue-800">
                {loading ? t('common.loading') : t('auth.sendOtp')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

              <div className="border-t pt-4">
                <button
                  onClick={() => setStep('token')}
                  className="text-sm text-blue-600 hover:underline w-full text-center"
                >
                  {t('auth.inviteToken')}
                </button>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-xs">
                  {t('auth.noPublicSignup')}
                </AlertDescription>
              </Alert>
            </>
          )}

          {step === 'otp' && (
            <>
              <p className="text-sm text-gray-600 text-center">
                {t('auth.otpSent', { contact })}
              </p>
              <div className="space-y-2">
                <Label>{t('auth.enterOtp')}</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t('auth.otpPlaceholder')}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  className={cn('h-14 text-center text-2xl tracking-[0.5em] font-mono')}
                />
              </div>
              <Button onClick={handleVerify} disabled={otp.length < 6 || loading} className="w-full h-12 bg-blue-700 hover:bg-blue-800">
                {loading ? t('common.loading') : t('auth.verify')}
              </Button>
              <button onClick={() => { setStep('contact'); setOtp(''); setError(null) }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto">
                <ChevronLeft className="h-4 w-4" /> {t('auth.back')}
              </button>
            </>
          )}

          {step === 'token' && (
            <>
              <p className="text-sm text-gray-600 text-center">{t('auth.enterInviteToken')}</p>
              <div className="space-y-2">
                <Label>{t('auth.inviteToken')}</Label>
                <Input
                  type="text"
                  placeholder="ELOHIM-XXXX-XXXX"
                  value={token}
                  onChange={e => setToken(e.target.value.toUpperCase())}
                  className="h-12 font-mono text-center tracking-wider"
                />
              </div>
              <Button onClick={handleUseToken} disabled={!token.trim() || loading} className="w-full h-12 bg-blue-700 hover:bg-blue-800">
                {loading ? t('common.loading') : t('auth.useToken')}
              </Button>
              <button onClick={() => { setStep('contact'); setToken(''); setError(null) }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto">
                <ChevronLeft className="h-4 w-4" /> {t('auth.back')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
