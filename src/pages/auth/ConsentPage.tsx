import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useAuditLog } from '@/hooks/useAuditLog'
import { supabase } from '@/integrations/supabase/client'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface ConsentRecord {
  id: string
  version: number
  granted: boolean
  granted_at: string | null
  revoked_at: string | null
  consent_text: string
  created_at: string
}

interface StudentRecord {
  id: string
  full_name: string
  consent_status: string
}

export default function ConsentPage() {
  const { t } = useTranslation()
  const { profile, schoolId } = useAuth()
  const { logAction } = useAuditLog()
  const navigate = useNavigate()

  const [students, setStudents] = useState<StudentRecord[]>([])
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile || !schoolId) return
    loadData()
  }, [profile, schoolId])

  const loadData = async () => {
    setLoading(true)
    // Find guardian record
    const { data: guardian } = await supabase
      .from('guardians')
      .select('id')
      .eq('profile_id', profile!.id)
      .maybeSingle()

    if (!guardian) { setLoading(false); return }

    // Find children
    const { data: links } = await supabase
      .from('student_guardians')
      .select('student_id')
      .eq('guardian_id', guardian.id)

    const studentIds = (links ?? []).map(l => l.student_id)
    if (!studentIds.length) { setLoading(false); return }

    const { data: studs } = await supabase
      .from('students')
      .select('id, full_name, consent_status')
      .in('id', studentIds)

    setStudents((studs ?? []) as StudentRecord[])

    const { data: cons } = await supabase
      .from('parental_consents')
      .select('*')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false })

    setConsents((cons ?? []) as ConsentRecord[])
    setLoading(false)
  }

  const handleGrant = async (studentId: string) => {
    setSubmitting(true)
    setError(null)
    const { data: guardian } = await supabase
      .from('guardians')
      .select('id')
      .eq('profile_id', profile!.id)
      .maybeSingle()

    if (!guardian) { setError('Guardian record not found.'); setSubmitting(false); return }

    const prevConsents = consents.filter(c => c.student_id === studentId)
    const nextVersion = prevConsents.length + 1

    const { error: err } = await supabase.from('parental_consents').insert({
      student_id: studentId,
      guardian_id: guardian.id,
      school_id: schoolId!,
      version: nextVersion,
      granted: true,
      granted_at: new Date().toISOString(),
      consent_text: 'I consent to my child using the ShuleConnect educational platform.',
    })

    if (err) { setError(err.message); setSubmitting(false); return }

    await supabase.from('students').update({ consent_status: 'active' }).eq('id', studentId)

    await logAction({ action: 'consent_granted', entityType: 'students', entityId: studentId, details: { version: nextVersion } })

    await loadData()
    setSubmitting(false)
  }

  const handleRevoke = async (studentId: string) => {
    if (!confirm(t('consent.revokeConfirm'))) return
    setSubmitting(true)

    const latestConsent = consents.find(c => c.student_id === studentId && c.granted)
    if (latestConsent) {
      await supabase.from('parental_consents').update({ revoked_at: new Date().toISOString(), granted: false }).eq('id', latestConsent.id)
    }

    await supabase.from('students').update({ consent_status: 'suspended' }).eq('id', studentId)
    await logAction({ action: 'consent_revoked', entityType: 'students', entityId: studentId })

    await loadData()
    setSubmitting(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-500">{t('common.loading')}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-400/20 border border-blue-400/40 mb-3">
            <Shield className="h-7 w-7 text-blue-300" />
          </div>
          <h1 className="text-xl font-bold text-white">{t('consent.title')}</h1>
          <p className="text-blue-300 text-sm mt-1">{t('consent.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {students.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No students linked to your account.</p>
          )}

          {students.map(student => {
            const latestConsent = consents.find(c => c.student_id === student.id)
            const isActive = student.consent_status === 'active'

            return (
              <div key={student.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{student.full_name}</p>
                    {latestConsent?.granted_at && (
                      <p className="text-xs text-gray-500">
                        {t('consent.grantedAt', { date: format(new Date(latestConsent.granted_at), 'dd MMM yyyy') })}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className={isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {t('consent.status_active')}</span>
                    ) : (
                      <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {t('consent.status_pending')}</span>
                    )}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600">
                  {t('consent.description', { studentName: student.full_name })}
                </p>

                {latestConsent && (
                  <p className="text-xs text-gray-400">{t('consent.version', { version: latestConsent.version })}</p>
                )}

                <div className="flex gap-2">
                  {!isActive && (
                    <Button
                      size="sm"
                      onClick={() => handleGrant(student.id)}
                      disabled={submitting}
                      className="bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      {t('consent.grant')}
                    </Button>
                  )}
                  {isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevoke(student.id)}
                      disabled={submitting}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {t('consent.revoke')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  )
}
