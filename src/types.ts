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
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  blogUrl?: string;
  category: string;
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
  tagline?: string;
}

export interface Profile {
  name: string;
  alias: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  logoUrl?: string;
  iconUrl?: string;
  siteTitle?: string;
  speechBubbleText: string;
  bioLines: string[];
  location: string;
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

export interface SiteData {
  profile: Profile;
  socialLinks: SocialLink[];
  footerLinks?: FooterLink[];
  projects: Project[];
  techSkills?: TechSkill[];
}

export type AdminTab = 'profile' | 'projects' | 'skills' | 'links' | 'analytics' | 'system';
