// @ts-nocheck
import app from '../app'

// General Deno environment entry point
Deno.serve(app.fetch)
