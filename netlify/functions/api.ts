import app from '../../src/api/app'

export default async function handler(reqOrEvent: any, context?: any) {
  // If it's a standard Web API Request (Netlify Functions v2)
  if (reqOrEvent instanceof Request || (reqOrEvent && typeof reqOrEvent?.url === 'string')) {
    // If incoming request URL is /.netlify/functions/api/..., rewrite URL pathname to /api/... for Hono router
    let req = reqOrEvent
    const urlStr = reqOrEvent.url
    if (urlStr.includes('/.netlify/functions/api')) {
      const newUrl = urlStr.replace('/.netlify/functions/api', '/api')
      req = new Request(newUrl, reqOrEvent)
    }
    return app.fetch(req, { ...process.env, netlifyContext: context })
  }

  // Fallback for AWS Lambda / Netlify Functions v1 (event, context) format
  const { handle } = await import('hono/aws-lambda')
  const lambdaHandler = handle(app)
  return lambdaHandler(reqOrEvent, context)
}
