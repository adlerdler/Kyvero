import { SiteData, Profile, Project, TechSkill, Experience, VisitorLogEntry, SystemConfig, SocialLink, FooterLink, MediaItem, User } from '../types';

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
      const parseJsonIfString = (val: any) => {
        if (typeof val === 'string') {
          const trimmed = val.trim();
          if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
              return JSON.parse(trimmed);
            } catch {
              return val;
            }
          }
        }
        return val;
      };

      siteData.profile = {
        id: raw.id,
        name: raw.name || '',
        alias: raw.alias || 'KAITO LIN',
        title: parseJsonIfString(raw.title) || {},
        subtitle: parseJsonIfString(raw.subtitle) || {},
        avatarUrl: raw.avatar_url || raw.avatar || '',
        logoUrl: raw.logo_url,
        iconUrl: raw.icon_url,
        siteTitle: raw.site_title,
        speechBubbleText: parseJsonIfString(raw.speech_bubble_text) || {},
        bioLines: parseJsonIfString(raw.bio_lines || raw.bio) || {},
        location: parseJsonIfString(raw.location) || {},
        statusText: parseJsonIfString(raw.status_text || raw.status) || '',
        skills: raw.skills || [],
        blogUrl: raw.blog_url || 'https://dev.to',
        githubUrl: raw.github_url || 'https://github.com',
        copyrightText: raw.copyright_text,
        copyrightSubtext: raw.copyright_subtext
      };
    }
    
    if (data.systemConfigs && data.systemConfigs.length > 0) {
      const raw = data.systemConfigs[0];
      siteData.systemConfig = {
        id: raw.id,
        siteTitle: raw.site_title,
        logoUrl: raw.logo_url,
        iconUrl: raw.icon_url,
        copyrightText: raw.copyright_text,
        copyrightSubtext: raw.copyright_subtext,
        version: raw.version,
        buildChannel: raw.build_channel
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

    if (data.socialLinks) {
      siteData.socialLinks = data.socialLinks.map((l: any) => ({
        id: l.id,
        name: l.name,
        url: l.url,
        type: l.type,
        iconName: l.icon_name || 'Github',
        badgeText: l.badge_text,
        isPrimary: Boolean(l.is_primary)
      }));
    }

    if (data.footerLinks) {
      siteData.footerLinks = data.footerLinks.map((l: any) => ({
        id: l.id,
        name: l.name,
        url: l.url,
        iconType: l.icon_type
      }));
    }

    if (data.mediaItems) {
      siteData.mediaItems = data.mediaItems.map((m: any) => ({
        id: m.id,
        name: m.name || '',
        url: m.url,
        thumbnailUrl: m.thumbnail_url,
        type: m.type,
        category: m.category,
        fileName: m.file_name,
        createdAt: m.created_at,
        size: m.size
      }));
    }

    if (data.users) {
      siteData.users = data.users.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        password: u.password,
        role: u.role
      }));
    }

    if (data.analytics && Array.isArray(data.analytics)) {
      siteData.analytics = data.analytics.map((a: any) => ({
        id: a.id,
        timestamp: a.timestamp,
        path: a.path || '/',
        userAgent: a.user_agent || a.userAgent || '',
        referrer: a.referrer || '',
        ipHash: a.ip_hash || a.ipHash || ''
      }));
    }
    
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

export async function syncSystemConfigToBackend(config: SystemConfig) {
  const payload = {
    id: config.id || 'default',
    site_title: config.siteTitle,
    logo_url: config.logoUrl,
    icon_url: config.iconUrl,
    copyright_text: config.copyrightText,
    copyright_subtext: config.copyrightSubtext,
    version: config.version,
    build_channel: config.buildChannel
  };
  const res = await fetch(`${API_BASE}/system-config`, {
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
    blog_url: project.blogUrl,
    tags: project.tags,
    featured: project.featured,
    created_at: project.createdAt || new Date().toISOString()
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

export async function syncSocialLinkToBackend(link: SocialLink) {
  const payload = {
    id: link.id,
    name: link.name,
    url: link.url,
    type: link.type,
    icon_name: link.iconName,
    badge_text: link.badgeText,
    is_primary: link.isPrimary
  };
  const res = await fetch(`${API_BASE}/social-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteSocialLinkFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/social-links/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncFooterLinkToBackend(link: FooterLink) {
  const payload = {
    id: link.id,
    name: link.name,
    url: link.url,
    icon_type: link.iconType
  };
  const res = await fetch(`${API_BASE}/footer-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteFooterLinkFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/footer-links/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncMediaItemToBackend(item: MediaItem) {
  const payload = {
    id: item.id,
    name: item.name,
    url: item.url,
    thumbnail_url: item.thumbnailUrl,
    type: item.type,
    category: item.category,
    file_name: item.fileName,
    created_at: item.createdAt,
    size: item.size
  };
  const res = await fetch(`${API_BASE}/media-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteMediaItemFromBackend(id: string) {
  const res = await fetch(`${API_BASE}/media-items/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function syncUserToBackend(user: User) {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name || user.username || 'Admin',
    avatar: user.avatar || '',
    email: user.email || '',
    password: user.password,
    role: user.role || 'Administrator'
  };
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function syncVisitorLogToBackend(log: VisitorLogEntry) {
  const payload = {
    id: log.id,
    timestamp: log.timestamp,
    path: log.path,
    user_agent: log.userAgent,
    userAgent: log.userAgent,
    referrer: log.referrer,
    ip_hash: log.ipHash,
    ipHash: log.ipHash
  };
  const res = await fetch(`${API_BASE}/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
