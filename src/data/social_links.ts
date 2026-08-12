import { SocialLink } from '../types';

export const initialSocialLinks: SocialLink[] = [
  {
    id: 'link-1',
    name: 'GitHub',
    url: 'https://github.com',
    type: 'github',
    iconName: 'Github',
    badgeText: '100+ Repos',
    isPrimary: true
  },
  {
    id: 'link-2',
    name: 'Weekly Blog',
    url: 'https://dev.to',
    type: 'blog',
    iconName: 'BookOpen',
    badgeText: 'Weekly Blog',
    isPrimary: true
  },
  {
    id: 'link-3',
    name: 'Twitter',
    url: 'https://x.com',
    type: 'twitter',
    iconName: 'Twitter',
    badgeText: 'Tech & Art'
  },
  {
    id: 'link-4',
    name: 'Bilibili',
    url: 'https://bilibili.com',
    type: 'bilibili',
    iconName: 'Tv',
    badgeText: '动画 & 编程视频'
  },
  {
    id: 'link-5',
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    type: 'other',
    iconName: 'Linkedin',
    badgeText: 'Professional'
  },
  {
    id: 'link-6',
    name: 'ResearchGate',
    url: 'https://researchgate.net',
    type: 'other',
    iconName: 'FileText',
    badgeText: 'Academic'
  }
];
