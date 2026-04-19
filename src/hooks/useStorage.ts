import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface UploadedImage {
  url: string
  path: string
  caption: string
}

const BUCKET = 'property-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9._-]/gi, '_').toLowerCase()
}

export function usePropertyImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = useCallback(async (
    file: File,
    sellerId: string,
    slot: number
  ): Promise<UploadedImage | null> => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`${file.name} exceeds 5 MB limit`)
      return null
    }
    if (!file.type.startsWith('image/')) {
      setError(`${file.name} is not an image`)
      return null
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${sellerId}/${Date.now()}_slot${slot}.${ext}`

    setError(null)
    const { error: uploadError } = await (supabase as any).storage
      .from(BUCKET)
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      return null
    }

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
    const results: UploadedImage[] = []
    for (let i = 0; i < files.length; i++) {
      const result = await uploadImage(files[i], sellerId, startSlot + i)
      if (result) results.push(result)
    }
    setUploading(false)
    return results
  }, [uploadImage])

  return { uploadImage, uploadMultiple, removeImage, uploading, error }
}
