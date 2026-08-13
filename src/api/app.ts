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
  const supabaseUrl = clean(env?.VITE_SUPABASE_URL || env?.SUPABASE_URL || process?.env?.VITE_SUPABASE_URL || process?.env?.SUPABASE_URL);
  
  const supabaseKey = clean(
    env?.VITE_SUPABASE_KEY || 
    env?.SUPABASE_SERVICE_ROLE_KEY || 
    env?.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    env?.VITE_SUPABASE_ANON_KEY ||
    process?.env?.VITE_SUPABASE_KEY ||
    process?.env?.SUPABASE_SERVICE_ROLE_KEY
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

export default app;
