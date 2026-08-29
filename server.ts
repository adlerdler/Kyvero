import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Check for common typos in .env filename and load
const envPaths = ['.env', '.evn', '.env.local'];
for (const p of envPaths) {
  const fullPath = path.join(process.cwd(), p);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: true });
    break;
  }
}

import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Dynamic import apiApp AFTER environment variables are guaranteed to be loaded
  const { default: apiApp } = await import('./src/api/app');

  // Integration: Hono as a middleware in Express for API & Root SEO/LLM endpoints
  const honoBridge = async (req: express.Request, res: express.Response) => {
    // Basic bridge for API routes and root SEO/LLM routes
    const headers = new Headers();
    const sensitiveHeaders = ['apikey', 'authorization', 'content-length'];
    
    Object.entries(req.headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (value && !sensitiveHeaders.includes(lowerKey)) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    try {
      // Map root endpoints (/llm.txt, /sitemap.xml, etc.) to Hono's .basePath('/api') routes
      const targetPath = req.url.startsWith('/api/') ? req.url : `/api${req.url}`;
      const webReq = new Request(`http://${req.headers.host}${targetPath}`, {
        method: req.method,
        headers: headers,
        body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });
      
      const response = await apiApp.fetch(webReq);
      const body = await response.text();
      
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.send(body);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  app.all(['/api/*', '/sitemap.xml', '/robots.txt', '/llm.txt', '/llms.txt'], honoBridge);

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', async (req, res) => {
      try {
        const indexPath = path.join(distPath, 'index.html');
        let html = fs.readFileSync(indexPath, 'utf-8');
        
        // Call Hono to get metadata via internal loopback
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const rawProto = req.headers['x-forwarded-proto'];
        const proto = (typeof rawProto === 'string' ? rawProto.split(',')[0] : (req.protocol || 'https')).trim();
        const protocol = (proto === 'http' || proto === 'https') ? proto : 'https';

        const project = req.query.project as string;
        const lang = req.query.lang as string;
        
        const metadataUrl = `http://127.0.0.1:${PORT}/api/metadata?${project ? `project=${project}&` : ''}${lang ? `lang=${lang}` : ''}`;
        const metaRes = await fetch(metadataUrl);
        const meta = await metaRes.json() as any;

        if (meta) {
          const fullUrl = `${protocol}://${host}${req.url}`;
          const metaTags = `
            <title>${meta.title}</title>
            <meta name="description" content="${meta.description}" />
            <meta property="og:title" content="${meta.title}" />
            <meta property="og:description" content="${meta.description}" />
            ${meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}" />` : ''}
            <meta property="og:url" content="${fullUrl}" />
            <meta property="og:type" content="website" />
            <link rel="canonical" href="${fullUrl}" />
          `;
          html = html.replace('<title>A1L · 极客作品集 &amp; 个人主页</title>', metaTags);
          html = html.replace('<html lang="en">', `<html lang="${meta.lang || 'zh-CN'}">`);
        }

        res.send(html);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    // Server started
  });
}

startServer();
