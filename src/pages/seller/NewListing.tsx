import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle, ChevronLeft, ChevronRight, DollarSign, Home,
  MapPin, FileText, CreditCard, Upload, X, GripVertical, Image,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthContext } from '@/contexts/AuthContext'
import { useCreateProperty, useProperty, useUpdateProperty } from '@/hooks/useProperties'
import { useCountries, useRegions, useDistricts } from '@/hooks/useCountries'
import { usePropertyImageUpload, UploadedImage } from '@/hooks/useStorage'
import { PROPERTY_TYPES, DEAL_TYPES, CURRENCIES } from '@/lib/statusColors'
import { toast } from 'sonner'

const MAX_IMAGES = 6

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  property_type: z.string().min(1, 'Select a property type'),
  deal_type: z.enum(['sale', 'rent', 'lease']),
  country_id: z.string().optional().transform(v => v || undefined),
  region_id: z.string().optional().transform(v => v || undefined),
  district_id: z.string().optional().transform(v => v || undefined),
  neighborhood: z.string().optional(),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).min(1, 'Price must be greater than 0'),
  price_currency: z.string().min(1),
  price_negotiable: z.boolean().optional(),
  rent_period: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  size_sqm: z.number().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
})

type ListingForm = z.infer<typeof listingSchema>

const STEPS = [
  { id: 1, title: 'Details', icon: Home },
  { id: 2, title: 'Photos', icon: Image },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Description', icon: FileText },
  { id: 6, title: 'Payment', icon: CreditCard },
]

interface ImageSlot {
  file?: File
  preview?: string
  uploaded?: UploadedImage
  caption: string
}

export default function NewListing() {
  const navigate = useNavigate()
  const { id: editId } = useParams<{ id: string }>()
  const isEdit = Boolean(editId)

  const { profile } = useAuthContext()
  const { data: countries = [], isLoading: countriesLoading } = useCountries()
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const { uploadMultiple, removeImage, uploading, error: uploadError } = usePropertyImageUpload()

  const [step, setStep] = useState(1)
  const [paymentDone, setPaymentDone] = useState(false)
  const [images, setImages] = useState<ImageSlot[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: { deal_type: 'sale', price_currency: 'USD', price_negotiable: false },
  })

  const dealType = watch('deal_type')
  const countryId = watch('country_id')
  const regionId = watch('region_id')

  const { data: regions = [], isLoading: regionsLoading } = useRegions(countryId)
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(regionId)

  // Reset cascade when parent selection clears
  useEffect(() => { if (!countryId) { setValue('region_id', ''); setValue('district_id', '') } }, [countryId, setValue])
  useEffect(() => { if (!regionId) { setValue('district_id', '') } }, [regionId, setValue])

  // ─── Image handling ──────────────────────────────────────────────────────

  const onFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    addFiles(Array.from(e.dataTransfer.files))
  }, [images])

  const addFiles = (files: File[]) => {
    const remaining = MAX_IMAGES - images.length
    const toAdd = files.slice(0, remaining)
    const invalid = files.find(f => !f.type.startsWith('image/'))
    if (invalid) { toast.error('Only image files are allowed'); return }

    const newSlots: ImageSlot[] = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }))
    setImages(prev => [...prev, ...newSlots])
  }

  const removeSlot = async (idx: number) => {
    const slot = images[idx]
    if (slot.uploaded?.path) await removeImage(slot.uploaded.path)
    if (slot.preview) URL.revokeObjectURL(slot.preview)
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const updateCaption = (idx: number, caption: string) => {
    setImages(prev => prev.map((s, i) => i === idx ? { ...s, caption } : s))
  }

  // ─── Step navigation ─────────────────────────────────────────────────────

  const STEP_FIELDS: Record<number, (keyof ListingForm)[]> = {
    1: ['title', 'property_type', 'deal_type'],
    2: [],
    3: [],
    4: ['price', 'price_currency'],
    5: ['description'],
    6: [],
  }

  const goNext = async () => {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 || await trigger(fields)
    if (!valid) return
    setStep(s => s + 1)
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = async (data: ListingForm) => {
    if (!profile) { toast.error('Your profile is still loading. Please wait a moment and try again.'); return }
    if (!paymentDone) { toast.error('Complete the $50 listing fee payment first.'); return }

    try {
      // Upload pending images
      const pendingFiles = images.filter(s => s.file && !s.uploaded)
      let allUploaded = images.filter(s => s.uploaded).map(s => s.uploaded!)

      if (pendingFiles.length > 0) {
        setUploadProgress(10)
        const startSlot = allUploaded.length
        const uploaded = await uploadMultiple(pendingFiles.map(s => s.file!), profile.id, startSlot)
        // Apply captions from slots
        uploaded.forEach((u, i) => {
          u.caption = pendingFiles[i].caption
        })
        allUploaded = [...allUploaded, ...uploaded]
        setUploadProgress(80)
      }

      const featuredImage = allUploaded[0]?.url ?? null
      const imageUrls = allUploaded.map(u => u.url)

      const payload = {
        title: data.title,
        description: data.description,
        property_type: data.property_type as any,
        deal_type: data.deal_type,
        price: data.price,
        price_currency: data.price_currency,
        price_usd: data.price_currency === 'USD' ? data.price : null,
        price_negotiable: data.price_negotiable ?? false,
        rent_period: data.deal_type === 'rent' ? (data.rent_period || null) : null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        size_sqm: data.size_sqm ?? null,
        country_id: data.country_id || null,
        region_id: data.region_id || null,
        district_id: data.district_id || null,
        neighborhood: data.neighborhood || null,
        featured_image: featuredImage,
        images: imageUrls,
        seller_id: profile.id,
        status: 'draft' as const,
        latitude: null,
        longitude: null,
        is_featured: false,
      }

      if (isEdit && editId) {
        await updateProperty.mutateAsync({ id: editId, ...payload })
        toast.success('Listing updated successfully')
      } else {
        await createProperty.mutateAsync(payload)
        toast.success('Listing submitted! It will go live after admin review.')
      }

      setUploadProgress(100)
      navigate('/seller/listings')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save listing'
      toast.error(msg)
      setUploadProgress(0)
    }
  }

  const isPending = createProperty.isPending || updateProperty.isPending || uploading

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-primary">{isEdit ? 'Edit Listing' : 'List a Property'}</h1>
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
                onClick={() => isDone && setStep(s.id)}
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
          {/* ── Step 1: Property Details ── */}
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
                    {errors.deal_type && <p className="text-xs text-destructive">{errors.deal_type.message}</p>}
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

          {/* ── Step 2: Photos ── */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Property Photos</CardTitle>
                <CardDescription>Upload up to {MAX_IMAGES} photos. First photo is the cover image. Add a caption to each.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop zone */}
                {images.length < MAX_IMAGES && (
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/60 transition-colors cursor-pointer"
                    onDragOver={e => e.preventDefault()}
                    onDrop={onFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-sm">Drag & drop photos here, or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP — max 5 MB each — {MAX_IMAGES - images.length} slot{MAX_IMAGES - images.length !== 1 ? 's' : ''} remaining
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={e => {
                        if (e.target.files) addFiles(Array.from(e.target.files))
                        e.target.value = ''
                      }}
                    />
                  </div>
                )}

                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

                {/* Image grid */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    {images.map((slot, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-secondary rounded-lg border border-border">
                        <div className="relative w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={slot.preview ?? slot.uploaded?.url}
                            alt={`Property image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-gold/90 text-white py-0.5">Cover</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Photo {idx + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeSlot(idx)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Add a caption (e.g. 'Master bedroom with en-suite')"
                            value={slot.caption}
                            onChange={e => updateCaption(idx, e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <p className="text-xs text-center text-muted-foreground py-2">
                    No photos added yet. At least one photo is strongly recommended.
                  </p>
                )}
              </CardContent>
            </>
          )}

          {/* ── Step 3: Location ── */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Location</CardTitle>
                <CardDescription>Where is the property located? The more specific, the better.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Country */}
                <div className="space-y-1.5">
                  <Label>Country *</Label>
                  <Select
                    value={countryId ?? ''}
                    onValueChange={v => {
                      setValue('country_id', v || '')
                      setValue('region_id', '')
                      setValue('district_id', '')
                    }}
                    disabled={countriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={countriesLoading ? 'Loading countries…' : 'Select country'} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {countries.length === 0 && !countriesLoading && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">No countries found — check DB setup</div>
                      )}
                      {countries.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.flag_emoji ? `${c.flag_emoji} ` : ''}{c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                {countryId && (
                  <div className="space-y-1.5">
                    <Label>Region / State / Province</Label>
                    {regionsLoading ? (
                      <div className="h-10 rounded-md border border-border bg-muted animate-pulse" />
                    ) : regions.length > 0 ? (
                      <Select
                        value={regionId ?? ''}
                        onValueChange={v => { setValue('region_id', v || ''); setValue('district_id', '') }}
                      >
                        <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input {...register('region_id')} placeholder="Type region / state name" />
                    )}
                  </div>
                )}

                {/* District */}
                {regionId && (
                  <div className="space-y-1.5">
                    <Label>District / City</Label>
                    {districtsLoading ? (
                      <div className="h-10 rounded-md border border-border bg-muted animate-pulse" />
                    ) : districts.length > 0 ? (
                      <Select
                        value={watch('district_id') ?? ''}
                        onValueChange={v => setValue('district_id', v || '')}
                      >
                        <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input {...register('district_id')} placeholder="Type district / city name" />
                    )}
                  </div>
                )}

                {/* Neighborhood */}
                <div className="space-y-1.5">
                  <Label>Street / Neighborhood</Label>
                  <Input {...register('neighborhood')} placeholder="e.g. Oyster Bay, Masaki, Kinondoni" />
                  <p className="text-xs text-muted-foreground">Be as specific as you're comfortable with.</p>
                </div>
              </CardContent>
            </>
          )}

          {/* ── Step 4: Pricing ── */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Pricing</CardTitle>
                <CardDescription>Set your asking price. Commission (10%) is charged only on deal close.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Price *</Label>
                    <Input type="number" min={0} step="any" {...register('price', { valueAsNumber: true })} placeholder="e.g. 150000" />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Select defaultValue="USD" onValueChange={v => setValue('price_currency', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
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
                        <SelectItem value="daily">Per Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="negotiable"
                    {...register('price_negotiable')}
                    className="rounded border-border accent-gold"
                  />
                  <Label htmlFor="negotiable" className="cursor-pointer">Price is negotiable</Label>
                </div>

                {/* Commission preview */}
                <div className="bg-secondary rounded-lg p-4 border border-border text-sm">
                  <p className="font-medium text-muted-foreground mb-2">TzDalali commission on close (10%)</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>TzDalali Platform</span><span>5%</span></div>
                    <div className="flex justify-between"><span>Law Firm Partner</span><span>3%</span></div>
                    <div className="flex justify-between"><span>Tax Consultant</span><span>2%</span></div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* ── Step 5: Description ── */}
          {step === 5 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Description</CardTitle>
                <CardDescription>Write a compelling description to attract buyers. Be honest and thorough.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Property Description *</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Describe the property: features, condition, materials, views, nearby amenities, schools, transport, legal documentation status, development potential…"
                    className="min-h-[180px]"
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                  <p className="text-xs text-muted-foreground">Minimum 20 characters. The more detail, the more enquiries you'll get.</p>
                </div>
              </CardContent>
            </>
          )}

          {/* ── Step 6: Payment ── */}
          {step === 6 && (
            <>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Listing Fee Payment</CardTitle>
                <CardDescription>Pay the one-time $50 listing fee to activate your listing globally.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary rounded-lg p-5 border border-border">
                  <div className="flex justify-between mb-3">
                    <span className="text-muted-foreground text-sm">Listing Fee</span>
                    <span className="font-bold text-primary text-lg">$50.00</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Visible globally until sold, rented, or removed</li>
                    <li>• No subscription or monthly fees</li>
                    <li>• TzDalali markets your listing on all channels</li>
                    <li>• Commission of 10% only on deal close</li>
                  </ul>
                </div>

                {paymentDone ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Payment confirmed! Submit your listing below.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Select payment method:</p>
                    <Button
                      type="button"
                      variant="gold"
                      className="w-full"
                      onClick={() => {
                        toast.info('Stripe checkout will open here. Contact support@tzdalali.com to pay manually.')
                        setTimeout(() => setPaymentDone(true), 2000)
                      }}
                    >
                      Pay with Card — Stripe
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast.info('M-Pesa / Airtel Money: send to +255 621 468 940 with your email as reference.')
                        setTimeout(() => setPaymentDone(true), 2000)
                      }}
                    >
                      Pay with M-Pesa / Mobile Money
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Or email <a href="mailto:support@tzdalali.com" className="text-gold underline">support@tzdalali.com</a> to arrange manual payment.
                    </p>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Uploading photos…</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />Back
            </Button>
            <Badge variant="outline" className="text-muted-foreground">Step {step} of {STEPS.length}</Badge>
            {step < STEPS.length ? (
              <Button type="button" variant="gold" onClick={goNext}>
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gold"
                disabled={!paymentDone || isPending}
              >
                {isPending ? 'Submitting…' : isEdit ? 'Save Changes' : 'Submit Listing'}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  )
}
