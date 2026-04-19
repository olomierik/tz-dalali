import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Bed, Bath, Maximize2, Calendar, Layers, Car,
  Heart, Share2, Shield, Scale, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PriceDisplay } from '@/components/common/PriceDisplay'
import { useProperty, useProperties, useSavedProperties, useSaveProperty } from '@/hooks/useProperties'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { useAuthContext } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'

function ImageGallery({ featured, images }: { featured: string | null; images: unknown }) {
  const [active, setActive] = useState(0)
  const imgs: string[] = Array.isArray(images) && images.length > 0
    ? images as string[]
    : [featured ?? FALLBACK]

  const prev = () => setActive(i => (i - 1 + imgs.length) % imgs.length)
  const next = () => setActive(i => (i + 1) % imgs.length)

  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
        <img src={imgs[active]} alt="Property" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = FALLBACK }} />
        {imgs.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{active + 1}/{imgs.length}</span>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${i === active ? 'border-gold' : 'border-transparent'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = FALLBACK }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function InitiateDialog({ open, onClose, property }: { open: boolean; onClose: () => void; property: ReturnType<typeof useProperty>['data'] }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutateAsync: createTx, isPending } = useCreateTransaction()
  const [sourceOfFunds, setSourceOfFunds] = useState('')
  const [intendedUse, setIntendedUse] = useState('')
  const [agreed, setAgreed] = useState(false)

  if (!property) return null

  const commission = property.price * 0.10
  const lawFee = property.price * 0.03
  const taxFee = property.price * 0.02
  const platformFee = property.price * 0.05

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const handleSubmit = async () => {
    if (!sourceOfFunds.trim()) { toast({ title: 'Please fill in source of funds', variant: 'destructive' }); return }
    if (!intendedUse.trim()) { toast({ title: 'Please fill in intended use', variant: 'destructive' }); return }
    if (!agreed) { toast({ title: 'Please acknowledge the advisory', variant: 'destructive' }); return }

    try {
      const tx = await createTx({
        property_id: property.id,
        deal_type: property.deal_type,
        agreed_price: property.price,
        agreed_currency: property.price_currency,
        source_of_funds: sourceOfFunds,
        intended_use: intendedUse,
      })
      toast({ title: 'Transaction initiated!', description: `Reference: ${tx.reference_code}` })
      onClose()
      navigate(`/dashboard/transactions/${tx.id}`)
    } catch (err: unknown) {
      toast({ title: 'Error initiating transaction', description: err instanceof Error ? err.message : 'Please try again', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-primary">Initiate Transaction</DialogTitle>
          <DialogDescription>You are about to initiate a property transaction for:</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-secondary rounded-lg p-3 text-sm">
            <p className="font-semibold text-primary line-clamp-2">{property.title}</p>
            <p className="text-gold font-semibold mt-1">{fmt(property.price)}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 text-xs space-y-1">
            <p className="font-semibold text-primary mb-2">Commission Breakdown (10%)</p>
            <div className="flex justify-between"><span className="text-muted-foreground">TzDalali Platform (5%)</span><span>{fmt(platformFee)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Law Firm Partner (3%)</span><span>{fmt(lawFee)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax Consultant (2%)</span><span>{fmt(taxFee)}</span></div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold"><span>Total Commission</span><span className="text-gold">{fmt(commission)}</span></div>
          </div>
          <div>
            <Label className="text-sm">Source of Funds *</Label>
            <Input className="mt-1" placeholder="e.g. Personal savings, Bank loan" value={sourceOfFunds} onChange={e => setSourceOfFunds(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm">Intended Use *</Label>
            <Input className="mt-1" placeholder="e.g. Primary residence, Investment" value={intendedUse} onChange={e => setIntendedUse(e.target.value)} />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="advisory" checked={agreed} onCheckedChange={v => setAgreed(!!v)} />
            <Label htmlFor="advisory" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I acknowledge that TzDalali charges a 10% commission on this transaction (5% platform + 3% law firm + 2% tax consultant), payable from the agreed price.
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="gold" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Initiating…' : 'Initiate Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const { data: property, isLoading, error } = useProperty(id)
  const { data: savedIds = [] } = useSavedProperties()
  const { mutate: toggleSave } = useSaveProperty()
  const [txDialog, setTxDialog] = useState(false)
  const { data: similar = [] } = useProperties({ property_type: property?.property_type, country_id: property?.country_id ?? undefined, status: 'active' })

  if (isLoading) return (
    <div className="container py-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-32 w-full" /></div>
        <div><Skeleton className="h-48 w-full rounded-lg" /></div>
      </div>
    </div>
  )

  if (error || !property) return (
    <div className="container py-20 text-center">
      <h2 className="font-serif text-2xl text-primary mb-3">Property not found</h2>
      <p className="text-muted-foreground mb-6">This property may have been removed or the link is incorrect.</p>
      <Button onClick={() => navigate('/listings')}>Browse All Properties</Button>
    </div>
  )

  const isSaved = savedIds.includes(property.id)
  const similarProps = similar.filter(p => p.id !== property.id).slice(0, 3)

  const handleSave = () => {
    if (!user) { toast({ title: 'Sign in to save properties', variant: 'destructive' }); return }
    toggleSave({ propertyId: property.id, saved: isSaved })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: 'Link copied to clipboard' })
  }

  const handleProceed = () => {
    if (!user) { navigate('/auth', { state: { from: location } }); return }
    setTxDialog(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </button>

        <ImageGallery featured={property.featured_image} images={property.images} />

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="capitalize bg-primary text-primary-foreground">{property.deal_type === 'sale' ? 'For Sale' : property.deal_type === 'rent' ? 'For Rent' : 'Lease'}</Badge>
                <Badge variant="outline" className="capitalize">{property.property_type}</Badge>
                {property.is_verified && <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>}
                {property.is_featured && <Badge className="bg-gold text-gold-foreground">Featured</Badge>}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-3">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-gold" />
                <span>{[property.neighborhood, property.district_id && 'District', property.region_id && 'Region'].filter(Boolean).join(', ') || property.full_address || 'Location available on enquiry'}</span>
              </div>
            </div>

            <PriceDisplay price={property.price} currency={property.price_currency} priceUsd={property.price_usd} negotiable={property.price_negotiable ?? false} period={property.price_period ?? undefined} size="lg" />

            {/* Key stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {property.bedrooms != null && property.bedrooms > 0 && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Bed className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
              )}
              {property.bathrooms != null && property.bathrooms > 0 && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Bath className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Baths</p>
                </div>
              )}
              {property.size_sqm != null && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Maximize2 className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.size_sqm.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">m²</p>
                </div>
              )}
              {property.year_built != null && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Calendar className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.year_built}</p>
                  <p className="text-xs text-muted-foreground">Built</p>
                </div>
              )}
              {property.floors != null && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Layers className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.floors}</p>
                  <p className="text-xs text-muted-foreground">Floors</p>
                </div>
              )}
              {property.parking_spaces != null && property.parking_spaces > 0 && (
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <Car className="h-4 w-4 text-gold mx-auto mb-1" />
                  <p className="font-semibold text-sm">{property.parking_spaces}</p>
                  <p className="text-xs text-muted-foreground">Parking</p>
                </div>
              )}
            </div>

            {property.description && (
              <div>
                <h2 className="font-serif text-xl text-primary mb-2">Description</h2>
                <div className="gold-divider mb-4" />
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-primary mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">{(property.amenities as string[]).map((a, i) => <Badge key={i} variant="outline">{a}</Badge>)}</div>
              </div>
            )}

            {Array.isArray(property.features) && property.features.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-primary mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">{(property.features as string[]).map((f, i) => <Badge key={i} variant="outline">{f}</Badge>)}</div>
              </div>
            )}

            {property.title_deed_type && (
              <div className="bg-secondary rounded-lg p-4 border border-border">
                <h2 className="font-serif text-lg text-primary mb-2 flex items-center gap-2"><Scale className="h-4 w-4 text-gold" />Legal Information</h2>
                <div className="text-sm space-y-1">
                  <div className="flex gap-2"><span className="text-muted-foreground">Title Deed:</span><span>{property.title_deed_type}</span></div>
                  {property.legal_status && <div className="flex gap-2"><span className="text-muted-foreground">Legal Status:</span><span>{property.legal_status}</span></div>}
                  {property.legal_notes && <p className="text-muted-foreground mt-2 text-xs">{property.legal_notes}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Right: CTA sidebar */}
          <div className="lg:sticky lg:top-24 space-y-4 self-start">
            <div className="bg-card border border-border rounded-lg p-5 shadow-card">
              <PriceDisplay price={property.price} currency={property.price_currency} negotiable={property.price_negotiable ?? false} period={property.price_period ?? undefined} size="lg" className="mb-4" />
              <Button variant="gold" size="lg" className="w-full mb-3" onClick={handleProceed}>
                {property.deal_type === 'sale' ? 'Proceed to Buy' : 'Proceed to Rent'}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleSave}>
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-gold text-gold' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />Share
                </Button>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4 border border-border text-sm space-y-3">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <p className="text-muted-foreground"><span className="font-medium text-foreground">TzDalali acts as your broker.</span> All enquiries handled by our verified partner network.</p>
              </div>
              <Separator />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Commission: <span className="text-foreground font-medium">10% on deal value</span></p>
                <p>Law Firm: 3% · Tax Consultant: 2% · Platform: 5%</p>
                <p className="text-gold">TzDalali earns only when you close.</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>Questions? <a href="mailto:support@tzdalali.com" className="text-gold hover:underline">support@tzdalali.com</a></p>
            </div>
          </div>
        </div>

        {similarProps.length > 0 && (
          <div className="mt-16">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-2">Similar Properties</span>
            <h2 className="font-serif text-2xl text-primary mb-6">You may also like</h2>
            <PropertyGrid properties={similarProps} loading={false} savedIds={savedIds} onSaveToggle={handleSave} />
          </div>
        )}
      </div>

      <InitiateDialog open={txDialog} onClose={() => setTxDialog(false)} property={property} />
    </div>
  )
}
