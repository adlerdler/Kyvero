import { handle } from 'hono/netlify'
import app from '../../src/api/app'

export const handler = handle(app)
