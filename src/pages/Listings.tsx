import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Grid3X3, List, X, MapPin } from 'lucide-react'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { useProperties, useSavedProperties, useSaveProperty, type PropertyFilters } from '@/hooks/useProperties'
import { useCountries, useRegions, useDistricts } from '@/hooks/useCountries'
import { useAuthContext } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'office', label: 'Office' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'other', label: 'Other' },
]

type Filters = PropertyFilters & { property_types?: string[] }

// ─── Filter panel (sidebar + mobile sheet) ───────────────────────────────────

function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  onClear: () => void
}) {
  const { data: countries = [], isLoading: cLoading } = useCountries()
  const { data: regions = [], isLoading: rLoading } = useRegions(filters.country_id)
  const { data: districts = [], isLoading: dLoading } = useDistricts(filters.region_id)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={onClear}>
          <X className="h-3 w-3 mr-1" />Clear all
        </Button>
      </div>

      {/* Deal type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Deal Type</Label>
        <div className="flex flex-wrap gap-2">
          {[{ v: '', l: 'All' }, { v: 'sale', l: 'For Sale' }, { v: 'rent', l: 'For Rent' }, { v: 'lease', l: 'Lease' }].map(({ v, l }) => (
            <Button
              key={v} size="sm"
              variant={(!filters.deal_type && v === '') || filters.deal_type === v ? 'gold' : 'outline'}
              className="h-7 text-xs"
              onClick={() => onChange({ deal_type: (v as PropertyFilters['deal_type']) || undefined })}
            >{l}</Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Property type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Property Type</Label>
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map(pt => (
            <div key={pt.value} className="flex items-center gap-2">
              <Checkbox
                id={`pt-${pt.value}`}
                checked={(filters.property_types ?? []).includes(pt.value)}
                onCheckedChange={checked => {
                  const cur = filters.property_types ?? []
                  onChange({ property_types: checked ? [...cur, pt.value] : cur.filter(t => t !== pt.value) })
                }}
              />
              <Label htmlFor={`pt-${pt.value}`} className="text-sm cursor-pointer">{pt.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Location cascade */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
          <MapPin className="h-3 w-3 inline mr-1" />Location
        </Label>
        <div className="space-y-2">
          {/* Country */}
          <Select
            value={filters.country_id ?? '__any__'}
            onValueChange={v => onChange({ country_id: v === '__any__' ? undefined : v, region_id: undefined, district_id: undefined })}
            disabled={cLoading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder={cLoading ? 'Loading…' : 'Any country'} />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectItem value="__any__">Any country</SelectItem>
              {countries.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.flag_emoji ? `${c.flag_emoji} ` : ''}{c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Region — only when country selected */}
          {filters.country_id && (
            rLoading ? (
              <div className="h-9 rounded-md border border-border bg-muted animate-pulse" />
            ) : regions.length > 0 ? (
              <Select
                value={filters.region_id ?? '__any__'}
                onValueChange={v => onChange({ region_id: v === '__any__' ? undefined : v, district_id: undefined })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any region" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="__any__">Any region</SelectItem>
                  {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : null
          )}

          {/* District — only when region selected and districts exist */}
          {filters.region_id && (
            dLoading ? (
              <div className="h-9 rounded-md border border-border bg-muted animate-pulse" />
            ) : districts.length > 0 ? (
              <Select
                value={filters.district_id ?? '__any__'}
                onValueChange={v => onChange({ district_id: v === '__any__' ? undefined : v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any district" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="__any__">Any district</SelectItem>
                  {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : null
          )}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Price Range (USD)</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" className="h-9" value={filters.price_min ?? ''} onChange={e => onChange({ price_min: e.target.value ? +e.target.value : undefined })} />
          <Input type="number" placeholder="Max" className="h-9" value={filters.price_max ?? ''} onChange={e => onChange({ price_max: e.target.value ? +e.target.value : undefined })} />
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Min Bedrooms</Label>
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5].map(b => (
            <Button key={b} size="sm"
              variant={filters.bedrooms_min === b ? 'gold' : 'outline'}
              className="h-8 w-8 p-0 text-xs"
              onClick={() => onChange({ bedrooms_min: filters.bedrooms_min === b ? undefined : b })}
            >{b}{b === 5 ? '+' : ''}</Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Location quick-search bar ────────────────────────────────────────────────

function LocationBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
}) {
  const { data: countries = [] } = useCountries()
  const { data: regions = [] } = useRegions(filters.country_id)
  const { data: districts = [] } = useDistricts(filters.region_id)

  const activeCountry = countries.find(c => c.id === filters.country_id)
  const activeRegion = regions.find(r => r.id === filters.region_id)
  const activeDistrict = districts.find(d => d.id === filters.district_id)

  if (!activeCountry && !activeRegion && !activeDistrict) return null

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
      {activeCountry && (
        <Badge variant="secondary" className="gap-1 text-xs">
          {activeCountry.flag_emoji} {activeCountry.name}
          <button onClick={() => onChange({ country_id: undefined, region_id: undefined, district_id: undefined })} className="ml-1 hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
      {activeRegion && (
        <Badge variant="secondary" className="gap-1 text-xs">
          {activeRegion.name}
          <button onClick={() => onChange({ region_id: undefined, district_id: undefined })} className="ml-1 hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
      {activeDistrict && (
        <Badge variant="secondary" className="gap-1 text-xs">
          {activeDistrict.name}
          <button onClick={() => onChange({ district_id: undefined })} className="ml-1 hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
    </div>
  )
}

// ─── Main listings page ───────────────────────────────────────────────────────

const PAGE_SIZE = 12

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [page, setPage] = useState(+(searchParams.get('page') ?? 1))

  const [filters, setFilters] = useState<Filters>({
    deal_type: (searchParams.get('type') as PropertyFilters['deal_type']) || undefined,
    country_id: searchParams.get('country') || undefined,
    region_id: searchParams.get('region') || undefined,
    district_id: searchParams.get('district') || undefined,
    price_min: searchParams.get('minPrice') ? +searchParams.get('minPrice')! : undefined,
    price_max: searchParams.get('maxPrice') ? +searchParams.get('maxPrice')! : undefined,
    bedrooms_min: searchParams.get('beds') ? +searchParams.get('beds')! : undefined,
  })

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const activeFilters: Filters = { ...filters, search: debouncedSearch || undefined }
  const { data: properties = [], isLoading } = useProperties(activeFilters)
  const { data: savedIds = [] } = useSavedProperties()
  const { mutate: toggleSave } = useSaveProperty()

  const totalPages = Math.ceil(properties.length / PAGE_SIZE)
  const paged = properties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = useCallback((patch: Partial<Filters>) => {
    setFilters(f => ({ ...f, ...patch }))
    setPage(1)
  }, [])

  const handleClear = () => {
    setFilters({})
    setSearch('')
    setDebouncedSearch('')
    setPage(1)
  }

  const handleSave = (id: string, currently: boolean) => {
    if (!user) { toast({ title: 'Sign in to save properties', variant: 'destructive' }); return }
    toggleSave({ propertyId: id, saved: currently })
  }

  const activeCount = [
    filters.deal_type,
    filters.country_id,
    filters.region_id,
    filters.district_id,
    filters.price_min,
    filters.price_max,
    filters.bedrooms_min,
    ...(filters.property_types ?? []),
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {filters.deal_type === 'sale' ? 'Properties For Sale'
              : filters.deal_type === 'rent' ? 'Properties For Rent'
              : filters.deal_type === 'lease' ? 'Properties for Lease'
              : 'All Properties'}
          </h1>
          <p className="opacity-80 text-sm">Globally listed. Legally guaranteed. Escrow-protected.</p>
        </div>
      </div>

      <div className="container py-6">
        {/* Search + controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, neighbourhood, type…"
              className="pl-9 h-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-2 h-10" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge className="bg-gold text-white h-4 w-4 p-0 text-[10px] flex items-center justify-center rounded-full">{activeCount}</Badge>
            )}
          </Button>
          <div className="hidden sm:flex gap-1">
            <Button size="icon" variant={view === 'grid' ? 'default' : 'ghost'} className="h-10 w-10" onClick={() => setView('grid')}><Grid3X3 className="h-4 w-4" /></Button>
            <Button size="icon" variant={view === 'list' ? 'default' : 'ghost'} className="h-10 w-10" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Active location breadcrumb */}
        <LocationBar filters={filters} onChange={handleFilterChange} />

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-4">
              <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClear} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading…' : `${properties.length} propert${properties.length !== 1 ? 'ies' : 'y'} found`}
              </p>
            </div>

            {!isLoading && paged.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-primary mb-2">No properties found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search term.</p>
                <Button variant="outline" onClick={handleClear}>Clear all filters</Button>
              </div>
            ) : (
              <PropertyGrid properties={paged} loading={isLoading} view={view} savedIds={savedIds} onSaveToggle={handleSave} />
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <Button key={p} size="sm" variant={p === page ? 'default' : 'outline'} className="w-9 p-0" onClick={() => setPage(p)}>{p}</Button>
                ))}
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader className="mb-4"><SheetTitle>Filter Properties</SheetTitle></SheetHeader>
          <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClear} />
          <div className="mt-6">
            <Button className="w-full" onClick={() => setFilterOpen(false)}>
              Show Results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
