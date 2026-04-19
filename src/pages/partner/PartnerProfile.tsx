import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Globe, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const schema = z.object({
  full_name: z.string().min(2, 'Firm name is required'),
  phone: z.string().optional(),
  display_name: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function PartnerProfile() {
  const { profile, refreshProfile } = useAuthContext()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      display_name: profile?.display_name ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ full_name: data.full_name, phone: data.phone || null, display_name: data.display_name || null })
        .eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile updated')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const isLawFirm = profile?.role === 'law_firm'

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-primary">Partner Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your firm information.</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gold" />
            Firm Details
          </CardTitle>
          <CardDescription>
            You are a <strong>{isLawFirm ? 'Law Firm Partner' : 'Tax Consultant Partner'}</strong> — earning{' '}
            <strong>{isLawFirm ? '3%' : '2%'}</strong> commission per closed deal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Firm / Company Name *</Label>
              <Input {...register('full_name')} placeholder="e.g. GODVIL Consult" />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Display Name</Label>
              <Input {...register('display_name')} placeholder="Short name shown to clients" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />Phone / WhatsApp</Label>
              <Input {...register('phone')} placeholder="+255 621 468 940" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />Email</Label>
              <Input value={profile?.email ?? ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Contact support@tzdalali.com to change your email.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Partner Status</Label>
              <div>
                <Badge className="bg-green-100 text-green-700 border-green-200">Active Partner</Badge>
              </div>
            </div>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-gold" />
            About TzDalali Partnership
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>As a TzDalali partner, you handle the legal and compliance work for property transactions in your jurisdiction.</p>
          <p><strong className="text-foreground">Law Firms</strong> receive <strong>3%</strong> of the agreed deal value for title search, due diligence, contract drafting, and transfer registration.</p>
          <p><strong className="text-foreground">Tax Consultants</strong> receive <strong>2%</strong> for tax clearance, compliance checks, and fiscal documentation.</p>
          <p>All commissions are released from escrow at deal completion.</p>
        </CardContent>
      </Card>
    </div>
  )
}
