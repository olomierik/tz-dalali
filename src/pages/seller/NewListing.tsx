import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, ChevronLeft, ChevronRight, DollarSign, Home, MapPin, FileText, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthContext } from '@/contexts/AuthContext'
import { useCreateProperty } from '@/hooks/useProperties'
import { useCountries } from '@/hooks/useCountries'
import { toast } from 'sonner'

const STEPS = [
  { id: 1, title: 'Property Details', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Pricing', icon: DollarSign },
  { id: 4, title: 'Description', icon: FileText },
  { id: 5, title: 'Payment', icon: CreditCard },
]

const PROPERTY_TYPES = ['house','apartment','villa','land','commercial','office','warehouse','hotel','other']
const DEAL_TYPES = [{ value: 'sale', label: 'For Sale' }, { value: 'rent', label: 'For Rent' }, { value: 'lease', label: 'For Lease' }]
const CURRENCIES = ['USD','TZS','KES','GBP','EUR','AED','ZAR']

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  property_type: z.string().min(1, 'Select a property type'),
  deal_type: z.enum(['sale','rent','lease']),
  country_id: z.string().optional(),
  neighborhood: z.string().optional(),
  price: z.number().min(1, 'Price must be greater than 0'),
  price_currency: z.string().min(1),
  price_negotiable: z.boolean().optional(),
  rent_period: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  size_sqm: z.number().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  featured_image: z.string().optional(),
})

type ListingForm = z.infer<typeof listingSchema>

export default function NewListing() {
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const { data: countries = [] } = useCountries()
  const createProperty = useCreateProperty()
  const [step, setStep] = useState(1)
  const [paymentDone, setPaymentDone] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      deal_type: 'sale',
      price_currency: 'USD',
      price_negotiable: false,
    },
  })

  const dealType = watch('deal_type')

  const onSubmit = async (data: ListingForm) => {
    if (!profile) return
    if (step < 5) { setStep(s => s + 1); return }
    if (!paymentDone) {
      toast.error('Please complete the $50 listing fee payment first.')
      return
    }
    try {
      const property = await createProperty.mutateAsync({
        ...data,
        seller_id: profile.id,
        status: 'draft',
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        size_sqm: data.size_sqm ?? null,
        price_usd: data.price_currency === 'USD' ? data.price : null,
        featured_image: data.featured_image || null,
        images: null,
        country_id: data.country_id || null,
        region_id: null,
        district_id: null,
        neighborhood: data.neighborhood || null,
        latitude: null,
        longitude: null,
        is_featured: false,
        rent_period: data.rent_period || null,
        price_negotiable: data.price_negotiable ?? false,
      })
      toast.success('Listing submitted! It will go live after admin review.')
      navigate('/seller/listings')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create listing')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-primary">List a Property</h1>
        <p className="text-muted-foreground mt-1">Complete all steps to publish your listing globally.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s, idx) => {
          const Icon = s.icon
          const isActive = step === s.id
          const isDone = step > s.id
          return (
            <div key={s.id} className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive ? 'bg-gold text-white' :
                  isDone ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? <CheckCircle className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                {s.title}
              </button>
              {idx < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-card">
          {/* Step 1: Property Details */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Property Details</CardTitle>
                <CardDescription>Basic information about your property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Listing Title *</Label>
                  <Input id="title" {...register('title')} placeholder="e.g. Luxury 3-Bedroom Villa in Oyster Bay" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Property Type *</Label>
                    <Select onValueChange={v => setValue('property_type', v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.property_type && <p className="text-xs text-destructive">{errors.property_type.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Deal Type *</Label>
                    <Select defaultValue="sale" onValueChange={v => setValue('deal_type', v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DEAL_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Bedrooms</Label>
                    <Input type="number" min={0} {...register('bedrooms', { valueAsNumber: true })} placeholder="e.g. 3" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bathrooms</Label>
                    <Input type="number" min={0} {...register('bathrooms', { valueAsNumber: true })} placeholder="e.g. 2" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Size (m²)</Label>
                    <Input type="number" min={0} {...register('size_sqm', { valueAsNumber: true })} placeholder="e.g. 200" />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Location</CardTitle>
                <CardDescription>Where is the property located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Country *</Label>
                  <Select onValueChange={v => setValue('country_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {countries.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Neighborhood / Area</Label>
                  <Input {...register('neighborhood')} placeholder="e.g. Oyster Bay, Masaki" />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Pricing</CardTitle>
                <CardDescription>Set your asking price.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Price *</Label>
                    <Input type="number" min={0} {...register('price', { valueAsNumber: true })} placeholder="e.g. 150000" />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select defaultValue="USD" onValueChange={v => setValue('price_currency', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                {dealType === 'rent' && (
                  <div className="space-y-1.5">
                    <Label>Rent Period</Label>
                    <Select onValueChange={v => setValue('rent_period', v)}>
                      <SelectTrigger><SelectValue placeholder="Per month / year" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Per Month</SelectItem>
                        <SelectItem value="yearly">Per Year</SelectItem>
                        <SelectItem value="weekly">Per Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="negotiable" {...register('price_negotiable')} className="rounded" />
                  <Label htmlFor="negotiable">Price is negotiable</Label>
                </div>
                <div className="space-y-1.5">
                  <Label>Featured Image URL</Label>
                  <Input {...register('featured_image')} placeholder="https://…" />
                  <p className="text-xs text-muted-foreground">Paste a direct URL to the main property image.</p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Description</CardTitle>
                <CardDescription>Describe your property in detail to attract buyers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Description *</Label>
                  <Textarea {...register('description')} placeholder="Describe the property: features, condition, nearby amenities, legal status…" className="min-h-[160px]" />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Listing Fee Payment</CardTitle>
                <CardDescription>Pay the one-time $50 listing fee to activate your listing globally.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary rounded-lg p-5 border border-border">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Listing Fee</span>
                    <span className="font-bold text-primary text-lg">$50.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Your listing will be visible globally once approved</p>
                    <p>• One-time fee — no subscription or monthly charges</p>
                    <p>• Listed until sold, rented, or you remove it</p>
                    <p>• Commission only charged on deal close (10%)</p>
                  </div>
                </div>

                {paymentDone ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Payment confirmed! Submit your listing below.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Select payment method:</p>
                    <Button type="button" variant="gold" className="w-full" onClick={() => {
                      toast.info('Stripe payment integration coming soon. For now, contact support@tzdalali.com to pay manually.')
                      setTimeout(() => setPaymentDone(true), 1500)
                    }}>
                      Pay with Card (Stripe)
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => {
                      toast.info('Flutterwave M-Pesa integration coming soon. For now, contact support@tzdalali.com to pay manually.')
                      setTimeout(() => setPaymentDone(true), 1500)
                    }}>
                      Pay with M-Pesa / Mobile Money
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">Or email <a href="mailto:support@tzdalali.com" className="text-gold underline">support@tzdalali.com</a> to pay manually.</p>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />Back
            </Button>
            <Badge variant="outline" className="text-muted-foreground">Step {step} of {STEPS.length}</Badge>
            {step < 5 ? (
              <Button type="submit" variant="gold">
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" variant="gold" disabled={!paymentDone || createProperty.isPending}>
                {createProperty.isPending ? 'Submitting…' : 'Submit Listing'}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  )
}
