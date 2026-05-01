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
import { useProperties, useSavedProperties, useSaveProperty, type PropertyFilters, type Property } from '@/hooks/useProperties'
import { useCountries, useRegions, useDistricts } from '@/hooks/useCountries'
import { useAuthContext } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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

// ─── Booking.com Style Header ─────────────────────────────────────────────────

function ListingsHeader({
  title,
  subtitle,
  dealType,
  onDealTypeChange,
  lang,
}: {
  title: string
  subtitle: string
  dealType: string
  onDealTypeChange: (type: string) => void
  lang: 'en' | 'zh'
}) {
  const dealTypes = [
    { value: 'sale', labelEn: 'For Sale', labelZh: '出售' },
    { value: 'rent', labelEn: 'For Rent', labelZh: '出租' },
    { value: 'lease', labelEn: 'For Lease', labelZh: '长租' },
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container py-6">
        <h1 className="font-serif text-2xl md:text-3xl text-gray-900 mb-1">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
        
        {/* Deal type tabs */}
        <div className="flex items-center gap-1 mt-4">
          {dealTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onDealTypeChange(type.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                dealType === type.value
                  ? "bg-booking-blue text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {lang === 'en' ? type.labelEn : type.labelZh}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Filter panel (sidebar + mobile sheet) ───────────────────────────────────

function FilterPanel({
  filters,
  onChange,
  onClear,
  lang,
}: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  onClear: () => void
  lang: 'en' | 'zh'
}) {
  const { data: countries = [], isLoading: cLoading } = useCountries()
  const { data: regions = [], isLoading: rLoading } = useRegions(filters.country_id)
  const { data: districts = [], isLoading: dLoading } = useDistricts(filters.region_id)

  const labels = {
    filters: lang === 'en' ? 'Filters' : '筛选',
    clearAll: lang === 'en' ? 'Clear all' : '清除全部',
    dealType: lang === 'en' ? 'Deal Type' : '交易类型',
    all: lang === 'en' ? 'All' : '全部',
    forSale: lang === 'en' ? 'For Sale' : '出售',
    forRent: lang === 'en' ? 'For Rent' : '出租',
    lease: lang === 'en' ? 'For Lease' : '长租',
    propertyType: lang === 'en' ? 'Property Type' : '房产类型',
    location: lang === 'en' ? 'Location' : '位置',
    anyCountry: lang === 'en' ? 'Any country' : '任何国家',
    anyRegion: lang === 'en' ? 'Any region' : '任何地区',
    anyDistrict: lang === 'en' ? 'Any district' : '任何区',
    priceRange: lang === 'en' ? 'Price Range (USD)' : '价格范围 (美元)',
    min: lang === 'en' ? 'Min' : '最低',
    max: lang === 'en' ? 'Max' : '最高',
    bedrooms: lang === 'en' ? 'Bedrooms' : '卧室',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">{labels.filters}</h3>
        <Button variant="ghost" size="sm" className="text-xs text-booking-blue h-7" onClick={onClear}>
          <X className="h-3 w-3 mr-1" />{labels.clearAll}
        </Button>
      </div>

      {/* Deal type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">{labels.dealType}</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { v: '', l: labels.all },
            { v: 'sale', l: labels.forSale },
            { v: 'rent', l: labels.forRent },
            { v: 'lease', l: labels.lease },
          ].map(({ v, l }) => (
            <Button
              key={v} size="sm"
              variant={(!filters.deal_type && v === '') || filters.deal_type === v ? 'default' : 'outline'}
              className={(!filters.deal_type && v === '') || filters.deal_type === v 
                ? 'bg-booking-blue hover:bg-booking-blue-light text-white border-booking-blue'
                : 'border-gray-300 text-gray-700'}
              onClick={() => onChange({ deal_type: (v as PropertyFilters['deal_type']) || undefined })}
            >{l}</Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Property type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">{labels.propertyType}</Label>
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
              <Label htmlFor={`pt-${pt.value}`} className="text-sm cursor-pointer text-gray-700">{pt.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Location cascade */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">
          <MapPin className="h-3 w-3 inline mr-1" />{labels.location}
        </Label>
        <div className="space-y-2">
          {/* Country */}
          <Select
            value={filters.country_id ?? '__any__'}
            onValueChange={v => onChange({ country_id: v === '__any__' ? undefined : v, region_id: undefined, district_id: undefined })}
            disabled={cLoading}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder={cLoading ? 'Loading…' : labels.anyCountry} />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectItem value="__any__">{labels.anyCountry}</SelectItem>
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
              <div className="h-9 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
            ) : regions.length > 0 ? (
              <Select
                value={filters.region_id ?? '__any__'}
                onValueChange={v => onChange({ region_id: v === '__any__' ? undefined : v, district_id: undefined })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={labels.anyRegion} />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="__any__">{labels.anyRegion}</SelectItem>
                  {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : null
          )}

          {/* District — only when region selected and districts exist */}
          {filters.region_id && (
            dLoading ? (
              <div className="h-9 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
            ) : districts.length > 0 ? (
              <Select
                value={filters.district_id ?? '__any__'}
                onValueChange={v => onChange({ district_id: v === '__any__' ? undefined : v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={labels.anyDistrict} />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="__any__">{labels.anyDistrict}</SelectItem>
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
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">{labels.priceRange}</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder={labels.min} className="h-9" value={filters.price_min ?? ''} onChange={e => onChange({ price_min: e.target.value ? +e.target.value : undefined })} />
          <Input type="number" placeholder={labels.max} className="h-9" value={filters.price_max ?? ''} onChange={e => onChange({ price_max: e.target.value ? +e.target.value : undefined })} />
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">{labels.bedrooms}</Label>
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5].map(b => (
            <Button key={b} size="sm"
              variant={filters.bedrooms_min === b ? 'default' : 'outline'}
              className={filters.bedrooms_min === b 
                ? 'bg-booking-blue hover:bg-booking-blue-light text-white border-booking-blue h-8 w-8 p-0 text-xs'
                : 'border-gray-300 text-gray-700 h-8 w-8 p-0 text-xs'}
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
  lang,
}: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  lang: 'en' | 'zh'
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
      <MapPin className="h-3.5 w-3.5 text-booking-blue shrink-0" />
      {activeCountry && (
        <Badge variant="secondary" className="gap-1 text-xs bg-booking-blue-lighter text-booking-blue border-booking-blue/20">
          {activeCountry.flag_emoji} {activeCountry.name}
          <button onClick={() => onChange({ country_id: undefined, region_id: undefined, district_id: undefined })} className="ml-1 hover:text-booking-blue-light"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
      {activeRegion && (
        <Badge variant="secondary" className="gap-1 text-xs bg-booking-blue-lighter text-booking-blue border-booking-blue/20">
          {activeRegion.name}
          <button onClick={() => onChange({ region_id: undefined, district_id: undefined })} className="ml-1 hover:text-booking-blue-light"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
      {activeDistrict && (
        <Badge variant="secondary" className="gap-1 text-xs bg-booking-blue-lighter text-booking-blue border-booking-blue/20">
          {activeDistrict.name}
          <button onClick={() => onChange({ district_id: undefined })} className="ml-1 hover:text-booking-blue-light"><X className="h-2.5 w-2.5" /></button>
        </Badge>
      )}
    </div>
  )
}

// ─── Main listings page ───────────────────────────────────────────────────────

const PAGE_SIZE = 12

export default function Listings() {
  const [searchParams] = useSearchParams()
  const { user } = useAuthContext()
  const { t, lang } = useLanguage()
  const { toast } = useToast()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [page, setPage] = useState(+(searchParams.get('page') ?? 1))
  const [dealType, setDealType] = useState((searchParams.get('type') as PropertyFilters['deal_type']) || 'sale')

  const urlPropertyType = searchParams.get('property_type') || undefined

  const [filters, setFilters] = useState<Filters>({
    deal_type: dealType,
    property_type: urlPropertyType,
    country_id: searchParams.get('country') || undefined,
    region_id: searchParams.get('region') || undefined,
    district_id: searchParams.get('district') || undefined,
    price_min: searchParams.get('minPrice') ? +searchParams.get('minPrice')! : undefined,
    price_max: searchParams.get('maxPrice') ? +searchParams.get('maxPrice')! : undefined,
    bedrooms_min: searchParams.get('beds') ? +searchParams.get('beds')! : undefined,
    property_types: urlPropertyType ? [urlPropertyType] : undefined,
  })

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const handleDealTypeChange = (type: string) => {
    setDealType(type)
    setFilters(f => ({ ...f, deal_type: type as PropertyFilters['deal_type'] }))
    setPage(1)
  }

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
    setFilters({ deal_type: dealType })
    setSearch('')
    setDebouncedSearch('')
    setPage(1)
  }

  const handleSave = (id: string, currently: boolean) => {
    if (!user) { toast({ title: lang === 'en' ? 'Sign in to save properties' : '请先登录', variant: 'destructive' }); return }
    toggleSave({ propertyId: id, saved: currently })
  }

  const activeCount = [
    filters.country_id,
    filters.region_id,
    filters.district_id,
    filters.price_min,
    filters.price_max,
    filters.bedrooms_min,
    ...(filters.property_types ?? []),
  ].filter(Boolean).length

  const pageTitle = filters.property_type === 'commercial'
    ? t('listings.commercial')
    : filters.deal_type === 'sale'
    ? t('listings.sale')
    : filters.deal_type === 'rent'
    ? t('listings.rent')
    : filters.deal_type === 'lease'
    ? t('listings.lease')
    : t('listings.all')

  const resultText = isLoading
    ? t('listings.loading')
    : properties.length === 1
    ? t('listings.found_one')
    : t('listings.found', { n: properties.length })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Booking.com Style Header */}
      <ListingsHeader
        title={pageTitle}
        subtitle={t('listings.tagline')}
        dealType={dealType}
        onDealTypeChange={handleDealTypeChange}
        lang={lang}
      />

      <div className="container py-6">
        {/* Search + controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('listings.search_ph')}
              className="pl-9 h-10 bg-white border-gray-200 focus:border-booking-blue"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-2 h-10 border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            {t('listings.filters')}
            {activeCount > 0 && (
              <Badge className="bg-booking-blue text-white h-5 w-5 p-0 text-[10px] flex items-center justify-center rounded-full">{activeCount}</Badge>
            )}
          </Button>
          <div className="hidden sm:flex gap-1">
            <Button size="icon" variant={view === 'grid' ? 'default' : 'ghost'} className="h-10 w-10 bg-booking-blue hover:bg-booking-blue-light text-white" onClick={() => setView('grid')}><Grid3X3 className="h-4 w-4" /></Button>
            <Button size="icon" variant={view === 'list' ? 'default' : 'ghost'} className="h-10 w-10 border-gray-200 hover:bg-gray-50" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Active location breadcrumb */}
        <LocationBar filters={filters} onChange={handleFilterChange} lang={lang} />

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClear} lang={lang} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">{resultText}</p>
            </div>

            {!isLoading && paged.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-gray-900 mb-2">{t('listings.no_results')}</h3>
                <p className="text-gray-500 text-sm mb-6">{t('listings.no_results_sub')}</p>
                <Button variant="outline" onClick={handleClear} className="border-booking-blue text-booking-blue hover:bg-booking-blue-lighter">{t('listings.clear_filters')}</Button>
              </div>
            ) : (
              <PropertyGrid properties={paged} loading={isLoading} view={view} savedIds={savedIds} onSaveToggle={handleSave} />
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border-gray-200">{t('listings.previous')}</Button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <Button key={p} size="sm" variant={p === page ? 'default' : 'outline'} className={p === page ? 'bg-booking-blue hover:bg-booking-blue-light w-9 p-0' : 'border-gray-200 w-9 p-0'} onClick={() => setPage(p)}>{p}</Button>
                ))}
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="border-gray-200">{t('listings.next')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader className="mb-4"><SheetTitle>{lang === 'en' ? 'Filter Properties' : '筛选房产'}</SheetTitle></SheetHeader>
          <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClear} lang={lang} />
          <div className="mt-6">
            <Button className="w-full bg-booking-blue hover:bg-booking-blue-light" onClick={() => setFilterOpen(false)}>
              {lang === 'en' ? 'Show Results' : '显示结果'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
