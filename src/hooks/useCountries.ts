import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

// ─── Domain types ────────────────────────────────────────────────────────────

export interface Country {
  id: string
  name: string
  iso_code: string
  iso3_code: string | null
  flag_emoji: string | null
  currency_code: string | null
  currency_symbol: string | null
  phone_code: string | null
  is_active: boolean
}

export interface Region {
  id: string
  country_id: string
  name: string
  code: string | null
}

export interface District {
  id: string
  region_id: string
  name: string
  code: string | null
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const locationKeys = {
  countries: () => ['countries'] as const,
  regions: (countryId: string) => ['regions', countryId] as const,
  districts: (regionId: string) => ['districts', regionId] as const,
}

// East African countries shown first, in priority order
const EAST_AFRICA_ISO = ['TZ','KE','UG','RW','BI','ET','SS','SO','ER','DJ','MZ','MW','ZM','ZW','CD','MG','KM','SC','MU']

function sortCountries(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => {
    const ai = EAST_AFRICA_ISO.indexOf(a.iso_code)
    const bi = EAST_AFRICA_ISO.indexOf(b.iso_code)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.name.localeCompare(b.name)
  })
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
const CACHE_VER = 'v3'                                            // bump to bust stale caches
const COUNTRIES_CACHE_KEY = `tzdalali:countries:cache:${CACHE_VER}`
const COUNTRIES_CACHE_TS_KEY = `tzdalali:countries:ts:${CACHE_VER}`

// ─── localStorage cache helpers ──────────────────────────────────────────────

function loadCachedCountries(): Country[] | null {
  try {
    const ts = localStorage.getItem(COUNTRIES_CACHE_TS_KEY)
    if (!ts) return null
    const age = Date.now() - parseInt(ts, 10)
    if (age > SEVEN_DAYS_MS) return null
    const raw = localStorage.getItem(COUNTRIES_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Country[]
  } catch {
    return null
  }
}

function saveCachedCountries(countries: Country[]): void {
  try {
    localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(countries))
    localStorage.setItem(COUNTRIES_CACHE_TS_KEY, String(Date.now()))
  } catch {
    // localStorage may be full or unavailable; silently ignore
  }
}

// ─── useCountries ─────────────────────────────────────────────────────────────

export function useCountries() {
  return useQuery({
    queryKey: locationKeys.countries(),
    queryFn: async (): Promise<Country[]> => {
      // Serve from localStorage cache when fresh
      const cached = loadCachedCountries()
      if (cached) return sortCountries(cached)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('countries')
        .select('id, name, iso_code, iso3_code, flag_emoji, currency_code, currency_symbol, phone_code, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw new Error(error.message)

      const countries = sortCountries((data ?? []) as Country[])
      saveCachedCountries(countries)
      return countries
    },
    staleTime: SEVEN_DAYS_MS,
    gcTime: SEVEN_DAYS_MS,
  })
}

// ─── useRegions ───────────────────────────────────────────────────────────────

export function useRegions(countryId: string | undefined | null) {
  return useQuery({
    queryKey: locationKeys.regions(countryId ?? ''),
    enabled: !!countryId,
    queryFn: async (): Promise<Region[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('regions')
        .select('id, country_id, name, code')
        .eq('country_id', countryId)
        .order('name', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as Region[]
    },
    staleTime: SEVEN_DAYS_MS,
    gcTime: SEVEN_DAYS_MS,
  })
}

// ─── useDistricts ────────────────────────────────────────────────────────────

export function useDistricts(regionId: string | undefined | null) {
  return useQuery({
    queryKey: locationKeys.districts(regionId ?? ''),
    enabled: !!regionId,
    queryFn: async (): Promise<District[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('districts')
        .select('id, region_id, name, code')
        .eq('region_id', regionId)
        .order('name', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as District[]
    },
    staleTime: SEVEN_DAYS_MS,
    gcTime: SEVEN_DAYS_MS,
  })
}
