// @ts-nocheck
import { handle } from 'hono/fastly'
import app from '../app'

// Fastly Compute entry point
handle(app)
