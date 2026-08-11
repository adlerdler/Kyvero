import { SocialLink } from '../types';

export const initialSocialLinks: SocialLink[] = [
  {
    id: 'link-1',
    name: 'GitHub 开源主页',
    url: 'https://github.com',
    type: 'github',
    iconName: 'Github',
    badgeText: '100+ Repos',
    isPrimary: true
  },
  {
    id: 'link-2',
    name: '技术博客 (Medium / Dev.to)',
    url: 'https://dev.to',
    type: 'blog',
    iconName: 'BookOpen',
    badgeText: 'Weekly Blog',
    isPrimary: true
  },
  {
    id: 'link-3',
    name: 'Twitter / X 动态',
    url: 'https://x.com',
    type: 'twitter',
    iconName: 'Twitter',
    badgeText: 'Tech & Art'
  },
  {
    id: 'link-4',
    name: 'Bilibili 哔哩哔哩',
    url: 'https://bilibili.com',
    type: 'bilibili',
    iconName: 'Tv',
    badgeText: '动画 & 编程视频'
  },
  {
    id: 'link-5',
    name: '电子邮箱 (Email)',
    url: 'mailto:kaito.lin.dev@example.com',
    type: 'email',
    iconName: 'Mail',
    badgeText: 'Open for Hire'
  }
];
