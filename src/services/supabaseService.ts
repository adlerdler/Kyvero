import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import {
  SiteData,
  Profile,
  Project,
  TechSkill,
  Experience,
  SocialLink,
  FooterLink,
  MediaItem,
  SystemConfig,
  User,
  VisitorLogEntry
} from '../types';

export interface SyncResult {
  success: boolean;
  error?: string;
}

/**
 * Service to sync app state with Supabase PostgreSQL Database.
 */

// 1. Fetch all data from Supabase
export async function fetchAllSiteDataFromSupabase(): Promise<Partial<SiteData> | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const [
      { data: profiles, error: pErr },
      { data: systemConfigs, error: sysErr },
      { data: projects, error: projErr },
      { data: techSkills, error: tsErr },
      { data: experiences, error: expErr },
      { data: socialLinks, error: slErr },
      { data: footerLinks, error: flErr },
      { data: mediaItems, error: miErr },
      { data: users, error: uErr },
      { data: analytics, error: aErr }
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('system_config').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('tech_skills').select('*'),
      supabase.from('experiences').select('*'),
      supabase.from('social_links').select('*'),
      supabase.from('footer_links').select('*'),
      supabase.from('media_items').select('*'),
      supabase.from('users').select('*'),
      supabase.from('analytics').select('*').order('timestamp', { ascending: false }).limit(50)
    ]);

    if (pErr) console.warn('[Supabase Fetch Profiles Error]', pErr);
    if (sysErr) console.warn('[Supabase Fetch SystemConfig Error]', sysErr);
    if (projErr) console.warn('[Supabase Fetch Projects Error]', projErr);

    const result: Partial<SiteData> = {};

    // Map profile
    if (profiles && profiles.length > 0) {
      const raw = profiles[0];
      result.profile = {
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

    // Map systemConfig
    if (systemConfigs && systemConfigs.length > 0) {
      const raw = systemConfigs[0];
      result.systemConfig = {
        siteTitle: raw.site_title,
        logoUrl: raw.logo_url,
        iconUrl: raw.icon_url,
        copyrightText: raw.copyright_text,
        copyrightSubtext: raw.copyright_subtext,
        version: raw.version,
        buildChannel: raw.build_channel
      };
    }

    // Map projects
    if (projects) {
      result.projects = projects.map(p => ({
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

    // Map tech skills
    if (techSkills) {
      result.techSkills = techSkills.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category as any,
        level: Number(s.level || 80),
        color: s.color || 'cyan',
        iconName: s.icon || s.icon_name || 'Code',
        experience: s.years_of_experience ? `${s.years_of_experience} YEARS` : '3 YEARS',
        tagline: s.description || s.tagline || {}
      }));
    }

    // Map experiences
    if (experiences) {
      result.experiences = experiences.map(e => ({
        id: e.id,
        company: e.company || {},
        role: e.role || {},
        startDate: e.period ? e.period.split('-')[0]?.trim() || '2021' : '2021',
        endDate: e.period ? e.period.split('-')[1]?.trim() || 'Present' : 'Present',
        description: e.description || {},
        technologies: e.technologies || []
      }));
    }

    // Map social links
    if (socialLinks) {
      result.socialLinks = socialLinks.map(s => ({
        id: s.id,
        name: s.name,
        url: s.url,
        type: (s.type as any) || 'other',
        iconName: s.icon || s.icon_name || 'Globe',
        badgeText: s.badge || s.badge_text,
        isPrimary: Boolean(s.is_primary)
      }));
    }

    // Map footer links
    if (footerLinks) {
      result.footerLinks = footerLinks.map(f => ({
        id: f.id,
        name: f.name,
        url: f.url,
        iconType: f.icon_type as any
      }));
    }

    // Map media items
    if (mediaItems) {
      result.mediaItems = mediaItems.map(m => ({
        id: m.id,
        name: m.name,
        url: m.url,
        createdAt: m.created_at,
        size: m.size ? `${m.size} KB` : '120 KB'
      }));
    }

    // Map users
    if (users) {
      result.users = users.map(u => ({
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name,
        avatar: u.avatar || '',
        role: u.role || 'admin',
        email: u.email || ''
      }));
    }

    // Map analytics
    if (analytics) {
      result.analytics = analytics.map(a => ({
        id: a.id,
        timestamp: a.timestamp,
        path: a.path,
        userAgent: a.user_agent,
        referrer: a.referrer,
        ipHash: a.ip_hash
      }));
    }

    return result;
  } catch (err: any) {
    console.error('Error fetching data from Supabase:', err);
    return null;
  }
}

// 2. Save Profile
export async function syncProfileToSupabase(profile: Profile): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase 未连接/配置' };
  }
  
  const idToUse = profile.id || 'profile_default';
  
  const payload = {
    id: idToUse,
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
    github_url: profile.githubUrl,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('profiles').upsert(payload);
  if (error) {
    console.error('Supabase profile sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

// 3. Save System Config
export async function syncSystemConfigToSupabase(sysConfig: SystemConfig): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('system_config').upsert({
    id: 'default',
    site_title: sysConfig.siteTitle,
    logo_url: sysConfig.logoUrl,
    icon_url: sysConfig.iconUrl,
    copyright_text: sysConfig.copyrightText,
    copyright_subtext: sysConfig.copyrightSubtext,
    version: sysConfig.version,
    build_channel: sysConfig.buildChannel
  });
  if (error) {
    console.error('Supabase system_config sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

// 4. Save/Delete Projects
export async function syncProjectToSupabase(project: Project): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('projects').upsert({
    id: project.id,
    title: project.title,
    description: project.description,
    summary: project.summary,
    category: project.category,
    image_url: project.imageUrl,
    demo_url: project.demoUrl,
    github_url: project.githubUrl,
    tags: project.tags,
    featured: project.featured,
    created_at: project.createdAt || new Date().toISOString()
  });
  if (error) {
    console.error('Supabase project sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteProjectFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 5. Save/Delete Tech Skills
export async function syncTechSkillToSupabase(skill: TechSkill): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('tech_skills').upsert({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: skill.level,
    color: skill.color,
    experience: skill.experience || '3 Yrs',
    tagline: skill.tagline
  });
  if (error) {
    console.error('Supabase tech_skill sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteTechSkillFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('tech_skills').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 6. Save/Delete Experiences
export async function syncExperienceToSupabase(exp: Experience): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('experiences').upsert({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    start_date: exp.startDate,
    end_date: exp.endDate,
    description: exp.description,
    technologies: exp.technologies
  });
  if (error) {
    console.error('Supabase experience sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteExperienceFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 7. Save/Delete Social Links
export async function syncSocialLinkToSupabase(social: SocialLink): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('social_links').upsert({
    id: social.id,
    name: social.name,
    url: social.url,
    icon_name: social.iconName,
    type: social.type,
    badge_text: social.badgeText,
    is_primary: social.isPrimary
  });
  if (error) {
    console.error('Supabase social_link sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteSocialLinkFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 8. Save/Delete Footer Links
export async function syncFooterLinkToSupabase(link: FooterLink): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('footer_links').upsert({
    id: link.id,
    name: link.name,
    url: link.url,
    icon_type: link.iconType
  });
  if (error) {
    console.error('Supabase footer_link sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteFooterLinkFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('footer_links').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 9. Save/Delete Media Items
export async function syncMediaItemToSupabase(item: MediaItem): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('media_items').upsert({
    id: item.id,
    name: item.name,
    url: item.url,
    created_at: item.createdAt,
    size: item.size || '120 KB'
  });
  if (error) {
    console.error('Supabase media_item sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteMediaItemFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('media_items').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 10. Record Visitor Log
export async function syncVisitorLogToSupabase(log: VisitorLogEntry): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('analytics').insert({
    id: log.id,
    timestamp: log.timestamp,
    path: log.path,
    user_agent: log.userAgent,
    referrer: log.referrer || '',
    ip_hash: log.ipHash
  });
  if (error) {
    console.error('Supabase analytics sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

// 11. Save/Delete Users
export async function syncUserToSupabase(user: User): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('users').upsert({
    id: user.id,
    username: user.username,
    password: user.password,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    email: user.email
  });
  if (error) {
    console.error('Supabase user sync error:', error);
    return { success: false, error: `${error.message} (${error.code || ''})` };
  }
  return { success: true };
}

export async function deleteUserFromSupabase(id: string): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase 未连接/配置' };

  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
