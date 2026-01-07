import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxvvsxikyzzelwbxsnyz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dnZzeGlreXp6ZWx3Ynhzbnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjQzNTAsImV4cCI6MjA4MzM0MDM1MH0.B47cmRlJ6Zuf8xfWkfaLYJ_deV-aIPmtoYJCHWIbpq0'

export const supabase = createClient(supabaseUrl, supabaseKey)