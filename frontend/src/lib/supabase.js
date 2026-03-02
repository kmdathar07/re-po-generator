import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://prdikadvprykqrxegvzi.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZGlrYWR2cHJ5a3FyeGVndnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODYzMDAsImV4cCI6MjA4NzY2MjMwMH0.qxGvOaIQMkVQAexuJuOgdK0uai0tGbx3VmEmppSnEDE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)