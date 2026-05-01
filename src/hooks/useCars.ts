import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'

export interface Car {
  id: string
  owner_id: string
  country_id: string | null
  region_id: string | null
  district_id: string | null
  make: string
  model: string
  year: number
  price: number
  price_currency: string
  price_usd: number | null
  mileage: number | null
  mileage_unit: string
  body_type: string | null
  fuel_type: string | null
  transmission: string | null
  condition: string | null
  exterior_color: string | null
  interior_color: string | null
  engine_size: string | null
  vin: string | null
  description: string | null
  features: string[] | null
  images: string[] | null
  featured_image: string | null
  status: string
  is_featured: boolean
  is_verified: boolean
  views: number
  saves: number
  created_at: string
  updated_at: string
}

export interface CarFilters {
  make?: string
  model?: string
  country_id?: string
  price_min?: number
  price_max?: number
  year_min?: number
  year_max?: number
  status?: string
  limit?: number
}

export const carKeys = {
  all: ['cars'] as const,
  lists: () => [...carKeys.all, 'list'] as const,
  list: (filters: CarFilters) => [...carKeys.lists(), filters] as const,
  detail: (id: string) => [...carKeys.all, 'detail', id] as const,
  saved: () => [...carKeys.all, 'saved'] as const,
}

export function useCars(filters: CarFilters = {}) {
  return useQuery({
    queryKey: carKeys.list(filters),
    queryFn: async (): Promise<Car[]> => {
      let query = (supabase as any).from('cars').select('*')

      if (filters.status) query = query.eq('status', filters.status)
      else query = query.eq('status', 'active')

      if (filters.make) query = query.ilike('make', `%${filters.make}%`)
      if (filters.model) query = query.ilike('model', `%${filters.model}%`)
      if (filters.country_id) query = query.eq('country_id', filters.country_id)
      if (filters.price_min != null) query = query.gte('price_usd', filters.price_min)
      if (filters.price_max != null) query = query.lte('price_usd', filters.price_max)
      
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      if (filters.limit) query = query.limit(filters.limit)

      const { data, error } = await query
      if (error) throw error
      return (data || []) as Car[]
    }
  })
}

export function useCar(id: string | undefined) {
  return useQuery({
    queryKey: carKeys.detail(id ?? ''),
    enabled: !!id,
    queryFn: async (): Promise<Car | null> => {
      const { data, error } = await (supabase as any).from('cars').select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data as Car | null
    }
  })
}
