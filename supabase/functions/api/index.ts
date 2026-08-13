// @ts-nocheck
// Supabase Edge Function entry point for Hono API
import app from '../../../src/api/app'

// In Supabase Edge Functions (Deno), we can use the standard Web Fetch API
// Hono app's fetch method is compatible with Deno's serve
Deno.serve(app.fetch)
