export type LanguageCode = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  type: 'github' | 'blog' | 'twitter' | 'bilibili' | 'email' | 'other';
  iconName: string;
  badgeText?: string;
  isPrimary?: boolean;
}

export interface Project {
  id: string;
  title: Record<LanguageCode, string> | string;
  summary: Record<LanguageCode, string> | string;
  description: Record<LanguageCode, string> | string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  blogUrl?: string;
  category: Record<LanguageCode, string> | string;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

export interface TechSkill {
  id: string;
  name: string;
  level: number; // 0 - 100 percentage
  category: 'frontend' | 'backend' | 'ai' | 'architecture';
  color: string; // e.g. cyan, amber, emerald, violet, rose, sky
  iconName?: string;
  experience?: string;
  tagline?: Record<LanguageCode, string> | string;
}

export interface Profile {
  name: string;
  alias: string;
  title: Record<LanguageCode, string> | string;
  subtitle: Record<LanguageCode, string> | string;
  avatarUrl: string;
  logoUrl?: string;
  iconUrl?: string;
  siteTitle?: string;
  speechBubbleText: Record<LanguageCode, string> | string;
  bioLines: Record<LanguageCode, string[]> | string[];
  location: Record<LanguageCode, string> | string;
  statusText: string;
  skills: string[];
  blogUrl: string;
  githubUrl: string;
  copyrightText?: string;
  copyrightSubtext?: string;
}

export interface FooterLink {
  id: string;
  name: string;
  url: string;
  iconType: 'github' | 'twitter' | 'email' | 'blog' | 'bilibili' | 'other';
}

export interface SystemConfig {
  siteTitle: string;
  logoUrl: string;
  iconUrl: string;
  copyrightText: string;
  copyrightSubtext: string;
  version: string;
  buildChannel: string;
  footerLinks: FooterLink[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size?: string;
}

export interface Experience {
  id: string;
  company: Record<LanguageCode, string> | string;
  role: Record<LanguageCode, string> | string;
  startDate: string;
  endDate: string; // can be "Present" or similar, will keep as string
  description: Record<LanguageCode, string> | string;
  technologies?: string[];
}

export interface SiteData {
  profile: Profile;
  socialLinks: SocialLink[];
  footerLinks?: FooterLink[];
  projects: Project[];
  techSkills?: TechSkill[];
  mediaItems?: MediaItem[];
  experiences?: Experience[];
  systemConfig?: SystemConfig;
}

export type AdminTab = 'profile' | 'projects' | 'skills' | 'experience' | 'links' | 'media' | 'analytics' | 'system' | 'i18n';
