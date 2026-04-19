import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, User, Lock, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  display_name: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

const VERIFICATION_BADGE: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  verified: { label: 'Verified', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'Pending Review', icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200' },
  not_submitted: { label: 'Not Submitted', icon: Shield, className: 'bg-muted text-muted-foreground border-border' },
}

export default function Profile() {
  const { profile, refreshProfile } = useAuthContext()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      display_name: profile?.display_name ?? '',
    },
  })

  const { register: regPass, handleSubmit: handlePass, reset: resetPass, formState: { errors: passErrors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onSaveProfile = async (data: ProfileForm) => {
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ full_name: data.full_name, phone: data.phone || null, display_name: data.display_name || null })
        .eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.newPassword })
      if (error) throw error
      toast.success('Password updated successfully')
      resetPass()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update password')
    } finally {
      setChangingPassword(false)
    }
  }

  const verStatus = profile?.id_verification_status ?? 'not_submitted'
  const verBadge = VERIFICATION_BADGE[verStatus] ?? VERIFICATION_BADGE.not_submitted
  const VerIcon = verBadge.icon

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-primary">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </div>

      {/* Profile info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-gold" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" {...regProfile('full_name')} placeholder="John Doe" />
                {profileErrors.full_name && <p className="text-xs text-destructive">{profileErrors.full_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="display_name">Display Name</Label>
                <Input id="display_name" {...regProfile('display_name')} placeholder="How you appear on listings" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...regProfile('phone')} placeholder="+255 700 000 000" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={profile?.email ?? ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Account Role</Label>
              <div>
                <Badge variant="outline" className="capitalize">{profile?.role ?? '—'}</Badge>
              </div>
            </div>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>

      {/* ID Verification */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            Identity Verification
          </CardTitle>
          <CardDescription>Required to initiate property transactions on TzDalali.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={`${verBadge.className} flex items-center gap-1.5`}>
              <VerIcon className="h-3.5 w-3.5" />
              {verBadge.label}
            </Badge>
          </div>
          {verStatus === 'not_submitted' && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-800 text-sm">
                To verify your identity, please email a copy of your government-issued ID and a selfie to{' '}
                <a href="mailto:verify@tzdalali.com" className="underline font-medium">verify@tzdalali.com</a>.
                Include your account email in the subject line. Verification typically takes 1–2 business days.
              </AlertDescription>
            </Alert>
          )}
          {verStatus === 'pending' && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                Your verification documents are under review. This usually takes 1–2 business days. We'll notify you once the review is complete.
              </AlertDescription>
            </Alert>
          )}
          {verStatus === 'verified' && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Your identity has been verified. You can now initiate property transactions.
              </AlertDescription>
            </Alert>
          )}
          {verStatus === 'rejected' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-sm">
                Your verification was rejected. Please re-submit your documents to{' '}
                <a href="mailto:verify@tzdalali.com" className="underline font-medium">verify@tzdalali.com</a> with clearer images.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-gold" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePass(onChangePassword)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" {...regPass('newPassword')} placeholder="At least 6 characters" />
              {passErrors.newPassword && <p className="text-xs text-destructive">{passErrors.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" {...regPass('confirmPassword')} />
              {passErrors.confirmPassword && <p className="text-xs text-destructive">{passErrors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" variant="outline" disabled={changingPassword}>{changingPassword ? 'Updating…' : 'Update Password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
