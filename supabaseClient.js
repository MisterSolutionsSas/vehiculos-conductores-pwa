import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jhgooazzmiytkmslvhsp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZ29vYXp6bWl5dGttc2x2aHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDc2NzAsImV4cCI6MjA2MDQ4MzY3MH0.5Ya3dheb5icpqKSjGNjWV71b-f3J7ZcTsb-u-aDL4ho'

export const supabase = createClient(supabaseUrl, supabaseKey)
