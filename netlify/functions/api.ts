import { handle } from 'hono/netlify'
import app from '../../src/api/app'

export const config = {
  path: "/api/*"
}

export default handle(app)
