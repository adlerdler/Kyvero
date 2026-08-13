import { handle } from 'hono/aws-lambda'
import app from '../app'

// AWS Lambda & Lambda@Edge entry point
export const handler = handle(app)
