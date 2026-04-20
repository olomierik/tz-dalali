import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

const FALLBACKS = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=70',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=70',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=70',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=70',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=70',
]

/** Fetch a pool of property images to use as rotating page backgrounds. */
export function useBackgroundImages(limit = 24) {
  return useQuery({
    queryKey: ['background-images', limit],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('featured_image, images')
        .eq('status', 'active')
        .not('featured_image', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return FALLBACKS

      const urls: string[] = []
      for (const row of data ?? []) {
        if (row.featured_image) urls.push(row.featured_image as string)
        const arr = Array.isArray(row.images) ? (row.images as unknown[]) : []
        for (const img of arr) {
          if (typeof img === 'string') urls.push(img)
        }
      }
      const unique = Array.from(new Set(urls)).filter(Boolean)
      return unique.length > 0 ? unique : FALLBACKS
    },
  })
}
