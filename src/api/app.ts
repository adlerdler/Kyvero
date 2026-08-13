import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';

const app = new Hono().basePath('/api');

app.use('*', cors());

// Helper to get Supabase client lazily
let _supabase: any = null;
const getSupabase = (env: any) => {
  if (_supabase) return _supabase;

  const clean = (val: string | undefined) => (val || '').trim().replace(/['";]/g, '');
  
  // Platform agnostic env access: c.env (Edge) or process.env (Node)
  const supabaseUrl = clean(env?.SUPABASE_URL || env?.VITE_SUPABASE_URL || process?.env?.SUPABASE_URL || process?.env?.VITE_SUPABASE_URL);
  
  const supabaseKey = clean(
    env?.SUPABASE_KEY ||
    env?.SUPABASE_SERVICE_ROLE_KEY || 
    env?.VITE_SUPABASE_KEY || 
    env?.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    env?.VITE_SUPABASE_ANON_KEY ||
    process?.env?.SUPABASE_KEY ||
    process?.env?.SUPABASE_SERVICE_ROLE_KEY ||
    process?.env?.VITE_SUPABASE_KEY
  );

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  } 
  
  _supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return _supabase;
};

// --- ROUTES ---

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/site-data', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const [
      { data: profiles },
      { data: systemConfigs },
      { data: projects },
      { data: techSkills },
      { data: experiences },
      { data: socialLinks },
      { data: footerLinks },
      { data: mediaItems },
      { data: users },
      { count: analyticsCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('system_config').select('*'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tech_skills').select('*').order('level', { ascending: false }),
      supabase.from('experiences').select('*').order('start_date', { ascending: false }),
      supabase.from('social_links').select('*'),
      supabase.from('footer_links').select('*'),
      supabase.from('media_items').select('*'),
      supabase.from('users').select('*'),
      supabase.from('analytics').select('*', { count: 'exact', head: true })
    ]);

    return c.json({
      success: true,
      data: {
        profiles, systemConfigs, projects, techSkills, experiences,
        socialLinks, footerLinks, mediaItems, users, totalVisits: analyticsCount
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/profile', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('profiles').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/projects', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('projects').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/projects/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/experiences', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('experiences').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/experiences/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/tech-skills', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('tech_skills').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/tech-skills/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('tech_skills').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/analytics', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('analytics').insert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/system-config', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('system_config').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/social-links', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('social_links').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/social-links/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/footer-links', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('footer_links').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/footer-links/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('footer_links').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/media-items', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('media_items').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.delete('/media-items/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.post('/users', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const { error } = await supabase.from('users').upsert(body);
    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error }, 401);
  }
});

app.get('/metadata', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const projectId = c.req.query('project');
    const lang = c.req.query('lang') || 'zh-CN';
    
    let title = 'Kyvero Portfolio';
    let description = 'Modern Neo-Brutalist Portfolio & Analytics Console';
    let ogImage = '';

    const { data: config } = await supabase.from('system_config').select('*').limit(1).single();
    if (config) {
      title = config.site_title || title;
      description = config.site_description || description;
      ogImage = config.logo_url || '';
    }

    if (projectId) {
      const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (project) {
        title = `${project.title} | ${title}`;
        description = project.description || description;
        if (project.image_url) ogImage = project.image_url;
      }
    }

    return c.json({
      title,
      description,
      ogImage,
      lang
    });
  } catch (error) {
    return c.json({ title: 'Kyvero Portfolio', description: '' });
  }
});

const getBaseUrl = (c: any) => {
  const reqProto = c.req.header('x-forwarded-proto');
  const reqHost = c.req.header('x-forwarded-host') || c.req.header('host');
  if (reqHost) {
    const proto = (reqProto ? reqProto.split(',')[0].trim() : '') || 'https';
    return `${proto}://${reqHost}`;
  }
  return new URL(c.req.url).origin;
};

app.get('/sitemap.xml', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const baseUrl = getBaseUrl(c);
    const languages = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];

    // Fetch projects to include in sitemap
    const { data: projects } = await supabase
      .from('projects')
      .select('id, updated_at')
      .order('updated_at', { ascending: false });

    const now = new Date().toISOString();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Homepages for each language
    languages.forEach(lang => {
      xml += `
  <url>
    <loc>${baseUrl}/?lang=${lang}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    ${languages.map(alt => `<xhtml:link rel="alternate" hreflang="${alt.toLowerCase()}" href="${baseUrl}/?lang=${alt}"/>`).join('\n    ')}
  </url>`;
    });

    // Projects for each language
    if (projects) {
      projects.forEach((project: any) => {
        const lastMod = project.updated_at ? new Date(project.updated_at).toISOString() : now;
        languages.forEach(lang => {
          xml += `
  <url>
    <loc>${baseUrl}/?project=${project.id}&amp;lang=${lang}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${languages.map(alt => `<xhtml:link rel="alternate" hreflang="${alt.toLowerCase()}" href="${baseUrl}/?project=${project.id}&amp;lang=${alt}"/>`).join('\n    ')}
  </url>`;
        });
      });
    }

    xml += `
</urlset>`;

    return c.text(xml, 200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (error: any) {
    return c.text('Error generating sitemap', 500);
  }
});

app.get('/robots.txt', async (c) => {
  const baseUrl = getBaseUrl(c);
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;
  return c.text(content);
});

app.get('/llm.txt', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const baseUrl = getBaseUrl(c);

    // Fetch dynamic data for LLM context
    const [
      { data: projects },
      { data: skills },
      { data: config }
    ] = await Promise.all([
      supabase.from('projects').select('title, description, category, tags'),
      supabase.from('tech_skills').select('name, category'),
      supabase.from('system_config').select('site_title, site_description').limit(1).single()
    ]);

    const siteTitle = config?.site_title || 'Kyvero Portfolio';
    const siteDesc = config?.site_description || 'Modern Neo-Brutalist Portfolio Console';

    let content = `# ${siteTitle}

> ${siteDesc}

## Project Overview
Kyvero is a high-performance portfolio system featuring a Neo-Brutalist design aesthetic. It integrates real-time visitor analytics, global traffic radar, and a comprehensive administration console.

## Architecture
- **Frontend**: React 18, Vite, Tailwind CSS, Motion (Animations), D3.js (Data Visualization).
- **Backend**: Hono (Edge-ready Framework) running on Node.js.
- **Database**: Supabase (PostgreSQL) for persistent data and analytics.
- **Media**: Cloudinary CDN for optimized asset hosting.
- **I18N**: Professional dictionary-based support for zh-CN, zh-TW, en, ja, ko.

## Content Summary
- **Total Projects**: ${projects?.length || 0}
- **Tech Stack Entities**: ${skills?.length || 0}
- **Categories**: ${Array.from(new Set(projects?.map(p => p.category) || [])).join(', ')}

## Detailed Projects
${projects?.slice(0, 10).map(p => `- **${p.title}** (${p.category}): ${p.description}`).join('\n') || 'No projects listed.'}
${(projects?.length || 0) > 10 ? `\n...and ${(projects?.length || 0) - 10} more projects.` : ''}

## Technical Skills
${skills?.slice(0, 15).map(s => `- ${s.name} (${s.category})`).join('\n') || 'No skills listed.'}
${(skills?.length || 0) > 15 ? `\n...and ${(skills?.length || 0) - 15} more technical entities.` : ''}

## Key Features
- **Analytics Radar**: Real-time visitor tracking with GeoHash mapping and node latency monitoring.
- **Heatmap Matrix**: D3-powered 181-day visitor activity visualization.
- **Admin Console**: Secure /admin dashboard for full site management (CRUD).
- **Auto-Translation**: Integrated DeepL server-side translation for content.
- **SEO Ready**: Dynamic sitemap.xml and robots.txt generation.

## Navigation
- [Homepage](${baseUrl}/) - Main portfolio and analytics dashboard.
- [Admin Panel](${baseUrl}/admin) - Management console (Password protected).
- [Sitemap](${baseUrl}/sitemap.xml) - Search engine indexing data.

## License
Custom MIT License with Mandatory Attribution Clause.

---
Generated dynamically for LLM context. Version: 2.1.0 (Dynamic)`;

    return c.text(content, 200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // Shorter cache for dynamic content
    });
  } catch (error: any) {
    // Fallback to static description if DB fails
    return c.text('Error generating dynamic LLM context. Please try again later.', 500);
  }
});

app.get('/llms.txt', async (c) => {
  return c.redirect('/llm.txt');
});

app.post('/translate', async (c) => {
  try {
    const { sourceText } = await c.req.json();
    const apiKey = (c.env as any)?.DEEPL_API_KEY || process?.env?.DEEPL_API_KEY;

    if (!apiKey || apiKey === 'your-deepl-api-key') {
      return c.json({ success: false, error: 'DeepL API key not configured' }, 400);
    }

    const targetLanguages = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];
    const result: Record<string, string> = {};

    const mapDeepLLang = (code: string) => {
      if (code === 'zh-TW') return 'ZH-HANT';
      if (code === 'zh-CN') return 'ZH';
      if (code === 'en') return 'EN';
      if (code === 'ja') return 'JA';
      if (code === 'ko') return 'KO';
      return 'EN';
    };

    const isFreeKey = apiKey.endsWith(':fx');
    const apiUrl = isFreeKey 
      ? 'https://api-free.deepl.com/v2/translate' 
      : 'https://api.deepl.com/v2/translate';

    await Promise.all(
      targetLanguages.map(async (langCode) => {
        const deeplTarget = mapDeepLLang(langCode);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: [sourceText],
            target_lang: deeplTarget,
          }),
        });

        if (!response.ok) {
          throw new Error(`DeepL API error for ${langCode}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.translations && data.translations.length > 0) {
          result[langCode] = data.translations[0].text;
        }
      })
    );

    return c.json({ success: true, translations: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/cloudinary/sign', async (c) => {
  try {
    const { params } = await c.req.json();
    const secret = (c.env as any)?.CLOUDINARY_API_SECRET || (c.env as any)?.VITE_CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET || process?.env?.VITE_CLOUDINARY_API_SECRET;
    if (!secret) {
      return c.json({ success: false, error: 'Cloudinary API secret not configured on server' }, 400);
    }
    const paramObj = params || {};
    const sortedKeys = Object.keys(paramObj).sort();
    const signatureString = sortedKeys.map(key => `${key}=${paramObj[key]}`).join('&') + secret;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return c.json({ success: true, signature });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/cloudinary/destroy', async (c) => {
  try {
    const { public_id } = await c.req.json();
    const cloudName = (c.env as any)?.CLOUDINARY_CLOUD_NAME || (c.env as any)?.VITE_CLOUDINARY_CLOUD_NAME || process?.env?.CLOUDINARY_CLOUD_NAME || process?.env?.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = (c.env as any)?.CLOUDINARY_API_KEY || (c.env as any)?.VITE_CLOUDINARY_API_KEY || process?.env?.CLOUDINARY_API_KEY || process?.env?.VITE_CLOUDINARY_API_KEY;
    const secret = (c.env as any)?.CLOUDINARY_API_SECRET || (c.env as any)?.VITE_CLOUDINARY_API_SECRET || process?.env?.CLOUDINARY_API_SECRET || process?.env?.VITE_CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !secret || !public_id) {
      return c.json({ success: false, error: 'Cloudinary configuration or public_id missing' }, 400);
    }
    
    const timestamp = Math.round(Date.now() / 1000);
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${secret}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(signatureString));
    const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const formData = new FormData();
    formData.append('public_id', public_id);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return c.json({ success: data.result === 'ok', data });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
