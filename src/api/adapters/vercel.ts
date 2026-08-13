import { handle } from 'hono/vercel'
import app from '../app'

// Vercel Edge Functions entry point
export default handle(app)
