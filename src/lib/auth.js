import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey)

function getServerSupabase() {
  if (!isAuthConfigured) return null

  return createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

function getAccessToken() {
  return cookies().get('sb-access-token')?.value ?? null
}

export async function getUser() {
  if (!isAuthConfigured) return null

  const accessToken = getAccessToken()
  if (!accessToken) return null

  const supabase = getServerSupabase()
  if (!supabase) return null

  try {
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error) return null
    return data.user ?? null
  } catch {
    return null
  }
}

export async function getAuth() {
  const user = await getUser()
  return {
    userId: user?.id ?? null,
    user,
  }
}

/**
 * Returns { userId, user } from the current request context.
 * Throws if not authenticated.
 */
export async function requireAuth() {
  const { userId, user } = await getAuth()
  if (!userId) throw new Error('Unauthorized')
  return { userId, user }
}
