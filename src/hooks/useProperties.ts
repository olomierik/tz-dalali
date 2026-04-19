import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'

// ─── Domain types ────────────────────────────────────────────────────────────

export interface Property {
  id: string
  title: string
  description: string | null
  deal_type: 'sale' | 'rent' | 'lease'
  property_type:
    | 'house'
    | 'apartment'
    | 'villa'
    | 'land'
    | 'commercial'
    | 'office'
    | 'warehouse'
    | 'hotel'
    | 'other'
  status: 'active' | 'under_offer' | 'sold' | 'rented' | 'inactive' | 'draft'
  price: number
  price_currency: string
  price_usd: number | null
  price_negotiable: boolean
  rent_period: string | null
  bedrooms: number | null
  bathrooms: number | null
  size_sqm: number | null
  featured_image: string | null
  images: string[] | null
  country_id: string | null
  region_id: string | null
  district_id: string | null
  neighborhood: string | null
  latitude: number | null
  longitude: number | null
  seller_id: string
  views: number
  is_featured: boolean
  is_verified?: boolean | null
  full_address?: string | null
  amenities?: string[] | null
  features?: string[] | null
  year_built?: number | null
  floors?: number | null
  parking_spaces?: number | null
  title_deed_type?: string | null
  legal_status?: string | null
  legal_notes?: string | null
  price_period?: string | null
  created_at: string
  updated_at: string
}

export interface PropertyFilters {
  deal_type?: 'sale' | 'rent' | 'lease'
  property_type?: string
  country_id?: string
  region_id?: string
  district_id?: string
  price_min?: number
  price_max?: number
  bedrooms_min?: number
  search?: string
  status?: string
  seller_id?: string
  ids?: string[]
  limit?: number
}

export type CreatePropertyPayload = Omit<Property, 'id' | 'views' | 'created_at' | 'updated_at'>
export type UpdatePropertyPayload = Partial<CreatePropertyPayload> & { id: string }

// ─── Query keys ──────────────────────────────────────────────────────────────

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  saved: () => [...propertyKeys.all, 'saved'] as const,
}

const STALE_TIME = 5 * 60 * 1000

// ─── useProperties ───────────────────────────────────────────────────────────

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async (): Promise<Property[]> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('properties')
        .select('*')

      // 'any' skips status filter — used for seller's own listings view
      if (filters.status !== 'any') {
        query = query.eq('status', filters.status ?? 'active')
      }

      if (filters.deal_type) query = query.eq('deal_type', filters.deal_type)
      if (filters.property_type) query = query.eq('property_type', filters.property_type)
      if (filters.country_id) query = query.eq('country_id', filters.country_id)
      if (filters.region_id) query = query.eq('region_id', filters.region_id)
      if (filters.district_id) query = query.eq('district_id', filters.district_id)
      if (filters.seller_id) query = query.eq('seller_id', filters.seller_id)
      if (filters.ids?.length) query = query.in('id', filters.ids)
      if (filters.price_min != null) query = query.gte('price', filters.price_min)
      if (filters.price_max != null) query = query.lte('price', filters.price_max)
      if (filters.bedrooms_min != null) query = query.gte('bedrooms', filters.bedrooms_min)
      if (filters.search) query = query.ilike('title', `%${filters.search}%`)

      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (filters.limit) query = query.limit(filters.limit)

      const { data, error } = await query

      if (error) throw new Error(error.message)
      return (data ?? []) as Property[]
    },
    staleTime: STALE_TIME,
  })
}

// ─── useProperty ─────────────────────────────────────────────────────────────

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: propertyKeys.detail(id ?? ''),
    enabled: !!id,
    queryFn: async (): Promise<Property | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw new Error(error.message)

      // Increment views fire-and-forget
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(supabase as any)
          .from('properties')
          .update({ views: (data as Property).views + 1 })
          .eq('id', id)
          .then(() => {})
      }

      return data as Property | null
    },
    staleTime: STALE_TIME,
  })
}

// ─── useSavedProperties ──────────────────────────────────────────────────────

export function useSavedProperties() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: propertyKeys.saved(),
    enabled: !!user,
    queryFn: async (): Promise<string[]> => {
      if (!user) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id)

      if (error) throw new Error(error.message)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data ?? []) as any[]).map((row: { property_id: string }) => row.property_id)
    },
    staleTime: STALE_TIME,
  })
}

// ─── useSaveProperty ─────────────────────────────────────────────────────────

export function useSaveProperty() {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: async ({ propertyId, saved }: { propertyId: string; saved: boolean }) => {
      if (!user) throw new Error('Must be signed in to save properties')

      if (saved) {
        // Unsave
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId)

        if (error) throw new Error(error.message)
      } else {
        // Save
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('saved_properties')
          .insert({ user_id: user.id, property_id: propertyId })

        if (error) throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.saved() })
    },
  })
}

// ─── useCreateProperty ───────────────────────────────────────────────────────

export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePropertyPayload): Promise<Property> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('properties')
        .insert(payload)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Property
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

// ─── useUpdateProperty ───────────────────────────────────────────────────────

export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdatePropertyPayload): Promise<Property> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('properties')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Property
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) })
    },
  })
}
