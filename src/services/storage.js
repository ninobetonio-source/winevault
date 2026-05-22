import { supabase } from '../lib/supabase'

export async function uploadImage(bucket, file) {
  if (!file) return null
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { publicURL } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return publicURL
}

export async function deleteImage(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
  return true
}
