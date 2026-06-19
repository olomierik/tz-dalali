import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import i18n from '@/i18n'
import { Settings, Globe, MessageSquare, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { profile, schoolId, refreshProfile } = useAuth()
  const { toast } = useToast()

  const [lang, setLang] = useState<'en' | 'sw'>(profile?.language_pref ?? 'en')
  const [messagingEnabled, setMessagingEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    // Save language preference
    await supabase.from('profiles').update({ language_pref: lang }).eq('id', profile!.id)
    i18n.changeLanguage(lang)
    await refreshProfile()

    // Save school setting
    if (schoolId) {
      await supabase.from('schools').update({ student_teacher_messaging: messagingEnabled }).eq('id', schoolId)

      // Sync allowed_message_pairs
      await supabase.from('allowed_message_pairs').update({ enabled: messagingEnabled }).eq('school_id', schoolId).in('pair_type', ['teacher_student'])
    }

    setSaving(false)
    toast({ title: t('settings.saved'), description: `Language: ${lang === 'en' ? 'English' : 'Kiswahili'}` })
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Settings className="h-5 w-5 text-blue-700" />{t('settings.title')}
      </h1>

      {/* Language */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-blue-700" />
          <h2 className="font-semibold text-gray-900 text-sm">{t('settings.language')}</h2>
        </div>
        <div className="flex gap-3">
          {[{ value: 'en' as const, label: t('settings.english'), native: 'English' }, { value: 'sw' as const, label: t('settings.swahili'), native: 'Kiswahili' }].map(opt => (
            <button
              key={opt.value}
              onClick={() => setLang(opt.value)}
              className={`flex-1 flex items-center justify-between rounded-lg border px-4 py-3 transition-all ${lang === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{opt.native}</p>
                <p className="text-xs text-gray-500">{opt.label}</p>
              </div>
              {lang === opt.value && <Check className="h-4 w-4 text-blue-700" />}
            </button>
          ))}
        </div>
      </div>

      {/* Student-teacher messaging toggle (admin only) */}
      {profile?.role && ['super_admin', 'school_admin'].includes(profile.role) && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-blue-700" />
            <h2 className="font-semibold text-gray-900 text-sm">{t('settings.studentTeacherMessaging')}</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="msg-toggle" className="text-sm text-gray-700">
                {messagingEnabled ? t('settings.messagingEnabled') : t('settings.messagingDisabled')}
              </Label>
              <p className="text-xs text-gray-400 mt-0.5">When enabled, teachers can message students directly and vice-versa.</p>
            </div>
            <Switch id="msg-toggle" checked={messagingEnabled} onCheckedChange={setMessagingEnabled} />
          </div>
        </div>
      )}

      <Button onClick={handleSave} disabled={saving} className="bg-blue-700 hover:bg-blue-800">
        {saving ? t('common.loading') : t('settings.save')}
      </Button>
    </div>
  )
}
