'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let browserSupabase = null

export function getBrowserSupabase() {
  if (!isAuthConfigured) return null

  if (!browserSupabase) {
    browserSupabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
  }

  return browserSupabase
}
