import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkmreiuafoxpemakgsdc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbXJlaXVhZm94cGVtYWtnc2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzODQzNjUsImV4cCI6MjA2MDk2MDM2NX0.isYfEMqVOVUxnBsEGK3PyAnJdSpdf04YFX_4kNvInEA';

export const supabase = createClient(supabaseUrl, supabaseKey);