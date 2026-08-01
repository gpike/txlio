import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn at startup; non-fatal so local dev without Supabase still works
  console.warn('[db] Supabase env vars not set — DB calls will fail')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

// Server-side admin client (bypasses RLS) — use only in API routes
export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(supabaseUrl ?? '', serviceKey)
}
