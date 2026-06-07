const SUPABASE_URL = "https://zorfqkepqjoapmikfrhk.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcmZxa2VwcWpvYXBtaWtmcmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODU2MzcsImV4cCI6MjA5NjM2MTYzN30.I6n2OiaZnwgov2UVCLDJ-RknI7Rfsj46RWme_2X4PHY";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);