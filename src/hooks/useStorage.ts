import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface UploadedImage {
  url: string
  path: string
  caption: string
}

const BUCKET = 'property-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function usePropertyImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = useCallback(async (
    file: File,
    sellerId: string,
    slot: number
  ): Promise<UploadedImage> => {
    if (file.size > MAX_FILE_SIZE) throw new Error(`${file.name} exceeds 5 MB limit`)
    if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image`)

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${sellerId}/${Date.now()}_slot${slot}.${ext}`

    const { error: uploadError } = await (supabase as any).storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) throw new Error(uploadError.message)

    const { data } = (supabase as any).storage.from(BUCKET).getPublicUrl(path)
    return { url: data.publicUrl as string, path, caption: '' }
  }, [])

  const removeImage = useCallback(async (path: string): Promise<void> => {
    await (supabase as any).storage.from(BUCKET).remove([path])
  }, [])

  const uploadMultiple = useCallback(async (
    files: File[],
    sellerId: string,
    startSlot = 0
  ): Promise<UploadedImage[]> => {
    setUploading(true)
    setError(null)
    try {
      const results = await Promise.all(
        files.map((file, i) => uploadImage(file, sellerId, startSlot + i))
      )
      return results
    } catch (err: any) {
      const msg = err?.message ?? 'Image upload failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setUploading(false)
    }
  }, [uploadImage])

  return { uploadImage, uploadMultiple, removeImage, uploading, error }
}
