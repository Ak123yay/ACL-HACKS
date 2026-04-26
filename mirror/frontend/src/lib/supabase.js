import { createClient } from '@supabase/supabase-js'
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY
if (!supabaseUrl || !supabaseAnon) {
  console.warn('[Mirror] Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or legacy VITE_SUPABASE_KEY) in .env')
}
export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseAnon || 'placeholder-anon-key'
)
