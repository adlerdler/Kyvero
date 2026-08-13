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

  // Integration: Hono as a middleware in Express
  app.all('/api/*', async (req, res) => {
    // Basic bridge for API routes
    const headers = new Headers();
    const sensitiveHeaders = ['apikey', 'authorization', 'content-length'];
    
    Object.entries(req.headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (value && !sensitiveHeaders.includes(lowerKey)) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    try {
      const webReq = new Request(`http://${req.headers.host}${req.url}`, {
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
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    // Server started
  });
}

startServer();
