import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Shield, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OnboardingPage() {
  const { t } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [schoolName, setSchoolName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fullName = (user?.user_metadata?.full_name as string) ?? ''

  const handleCreate = async () => {
    if (!schoolName.trim() || !country.trim()) return
    setSaving(true)
    setError(null)

    const slug = schoolName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Create school
    const { data: school, error: schoolErr } = await supabase
      .from('schools')
      .insert({ name: schoolName.trim(), slug, country: country.trim(), city: city.trim() || null, phone: phone.trim() || null })
      .select()
      .single()

    if (schoolErr || !school) {
      setSaving(false)
      setError(schoolErr?.message ?? 'Failed to create school.')
      return
    }

    // Create profile as school_admin
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: user!.id,
      school_id: school.id,
      full_name: fullName || schoolName + ' Admin',
      email: user!.email ?? '',
      role: 'school_admin',
    })

    if (profileErr) {
      setSaving(false)
      setError(profileErr.message)
      return
    }

    // Seed default message pairs for this school
    await supabase.rpc('seed_allowed_message_pairs', { p_school_id: school.id })

    await refreshProfile()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-400/20 border border-blue-400/40 mb-4">
            <Building2 className="h-8 w-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('onboarding.title')}</h1>
          <p className="text-blue-300 text-sm mt-1">{t('onboarding.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Shield className="h-4 w-4 text-blue-700" />
            <p className="text-sm text-gray-500">
              {t('onboarding.welcomeUser', { name: fullName || user?.email })}
            </p>
          </div>

          <div className="space-y-1">
            <Label>{t('onboarding.schoolName')} <span className="text-red-500">*</span></Label>
            <Input
              placeholder={t('onboarding.schoolNamePlaceholder')}
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-1">
            <Label>{t('onboarding.country')} <span className="text-red-500">*</span></Label>
            <Input
              placeholder={t('onboarding.countryPlaceholder')}
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>{t('onboarding.city')}</Label>
              <Input
                placeholder={t('onboarding.cityPlaceholder')}
                value={city}
                onChange={e => setCity(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>{t('onboarding.phone')}</Label>
              <Input
                placeholder="+255 27 000 0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!schoolName.trim() || !country.trim() || saving}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800"
          >
            {saving ? t('common.loading') : t('onboarding.createSchool')}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            {t('onboarding.adminNote')}
          </p>
        </div>
      </div>
    </div>
  )
}
