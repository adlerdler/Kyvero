import { SiteData, Profile, Project, TechSkill, Experience, VisitorLogEntry } from '../types';

const API_BASE = '/api';

/**
 * Service to interact with the Hono backend API.
 * This ensures all Supabase calls happen on the server-side.
 */

export async function fetchAllSiteDataFromBackend(): Promise<Partial<SiteData> | null> {
  try {
    const res = await fetch(`${API_BASE}/site-data`);
    const result = await res.json();
    
    if (!result.success) throw new Error(result.error);
    
    const { data } = result;
    
    // Process mapping (similar to what was in supabaseService.ts)
    const siteData: Partial<SiteData> = {};
    
    if (data.totalVisits !== undefined) siteData.totalVisits = data.totalVisits;
    
    if (data.profiles && data.profiles.length > 0) {
      const raw = data.profiles[0];
      siteData.profile = {
        id: raw.id,
        name: raw.name || '',
        alias: raw.alias || 'KAITO LIN',
        title: raw.title || {},
        subtitle: raw.subtitle || {},
        avatarUrl: raw.avatar_url || raw.avatar || '',
        logoUrl: raw.logo_url,
        iconUrl: raw.icon_url,
        siteTitle: raw.site_title,
        speechBubbleText: raw.speech_bubble_text || {},
        bioLines: raw.bio_lines || raw.bio || {},
        location: raw.location || {},
        statusText: raw.status_text || raw.status || '',
        skills: raw.skills || [],
        blogUrl: raw.blog_url || 'https://dev.to',
        githubUrl: raw.github_url || 'https://github.com',
        copyrightText: raw.copyright_text,
        copyrightSubtext: raw.copyright_subtext
      };
    }
    
    if (data.projects) {
      siteData.projects = data.projects.map((p: any) => ({
        id: p.id,
        title: p.title || {},
        summary: p.summary || p.description || {},
        description: p.description || {},
        imageUrl: p.cover_image || p.image_url || '',
        demoUrl: p.demo_url,
        githubUrl: p.github_url,
        blogUrl: p.blog_url,
        category: p.category || {},
        tags: p.tags || [],
        featured: Boolean(p.featured),
        createdAt: p.created_at || new Date().toISOString()
      }));
    }
    
    if (data.techSkills) {
      siteData.techSkills = data.techSkills.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        level: Number(s.level || 80),
        color: s.color || 'cyan',
        iconName: s.icon || s.icon_name || 'Code',
        experience: s.years_of_experience ? `${s.years_of_experience} YEARS` : '3 YEARS',
        tagline: s.description || s.tagline || {}
      }));
    }
    
    if (data.experiences) {
      siteData.experiences = data.experiences.map((e: any) => ({
        id: e.id,
        company: e.company || {},
        role: e.role || {},
        startDate: e.start_date || '2021',
        endDate: e.end_date || 'Present',
        description: e.description || {},
        technologies: e.technologies || []
      }));
    }

    // Add more mappings if needed (social links, footer, etc.)
    
    return siteData;
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    return null;
  }
}

export async function syncProfileToBackend(profile: Profile) {
  const payload = {
    id: profile.id,
    name: profile.name,
    alias: profile.alias,
    title: profile.title,
    subtitle: profile.subtitle,
    avatar_url: profile.avatarUrl,
    speech_bubble_text: profile.speechBubbleText,
    bio_lines: profile.bioLines,
    location: profile.location,
    status_text: profile.statusText,
    skills: profile.skills,
    blog_url: profile.blogUrl,
    github_url: profile.githubUrl
  };
  
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function syncProjectToBackend(project: Project) {
  const payload = {
    id: project.id,
    title: project.title,
    description: project.description,
    summary: project.summary,
    category: project.category,
    image_url: project.imageUrl,
    demo_url: project.demoUrl,
    github_url: project.githubUrl,
    tags: project.tags,
    featured: project.featured
  };
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteProjectFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncExperienceToBackend(exp: Experience) {
  const payload = {
    id: exp.id,
    company: exp.company,
    role: exp.role,
    start_date: exp.startDate,
    end_date: exp.endDate,
    description: exp.description,
    technologies: exp.technologies
  };
  const res = await fetch(`${API_BASE}/experiences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteExperienceFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/experiences/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncTechSkillToBackend(skill: TechSkill) {
  const payload = {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: skill.level,
    color: skill.color,
    experience: skill.experience || '3 Yrs',
    tagline: skill.tagline
  };
  const res = await fetch(`${API_BASE}/tech-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteTechSkillFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/tech-skills/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncVisitorLogToBackend(log: VisitorLogEntry) {
  const res = await fetch(`${API_BASE}/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  });
  return res.json();
}
