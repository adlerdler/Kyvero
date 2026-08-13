import app from '../../src/api/app'

export const config = {
  path: "/api/*"
}

export default async function handler(reqOrEvent: any, context?: any) {
  // If it's a standard Web API Request (Netlify Functions v2)
  if (reqOrEvent instanceof Request || (reqOrEvent && typeof reqOrEvent?.url === 'string')) {
    return app.fetch(reqOrEvent, { ...process.env, netlifyContext: context })
  }

  // Fallback for AWS Lambda / Netlify Functions v1 (event, context) format
  const { handle } = await import('hono/aws-lambda')
  const lambdaHandler = handle(app)
  return lambdaHandler(reqOrEvent, context)
}
