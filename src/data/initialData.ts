import { SiteData } from '../types';

export const INITIAL_SITE_DATA: SiteData = {
  profile: { 
    name: 'Kaito Lin', 
    alias: 'KAITO LIN',
    title: { 'zh-CN': '全栈开发者', 'en': 'Fullstack Developer', 'zh-TW': '全棧開發者', 'ja': 'フルスタック開発者', 'ko': '풀스택 개발자' },
    subtitle: { 'zh-CN': '专注于 Web 3.0 与 AI 集成', 'en': 'Focusing on Web 3.0 & AI Integration', 'zh-TW': '專注於 Web 3.0 與 AI 集成', 'ja': 'Web 3.0 と AI 統合に注力', 'ko': 'Web 3.0 및 AI 통합에 집중' },
    avatarUrl: '', 
    speechBubbleText: { 'zh-CN': '你好！欢迎来到我的空间。', 'en': 'Hello! Welcome to my space.', 'zh-TW': '你好！歡迎來到我的空間。', 'ja': 'こんにちは！私のスペースへようこそ。', 'ko': '안녕하세요! 제 공간에 오신 것을 환영합니다.' },
    bioLines: { 'zh-CN': [], 'en': [], 'zh-TW': [], 'ja': [], 'ko': [] },
    location: { 'zh-CN': '东京, 日本', 'en': 'Tokyo, Japan', 'zh-TW': '東京, 日本', 'ja': '東京, 日本', 'ko': '도쿄, 일본' },
    statusText: { 'zh-CN': '欢迎预约', 'en': 'Available for hire', 'zh-TW': '歡迎預約', 'ja': 'お仕事募集中', 'ko': '채용 가능' },
    skills: [],
    blogUrl: '',
    githubUrl: ''
  },
  socialLinks: [],
  footerLinks: [],
  projects: [],
  techSkills: [],
  mediaItems: [],
  experiences: [],
  analytics: [],
  totalVisits: 0,
  systemConfig: { 
    siteTitle: 'My Portfolio', 
    logoUrl: '', 
    iconUrl: '', 
    copyrightText: '© 2024 KAITO LIN', 
    copyrightSubtext: 'Built with ❤️',
    version: '1.0.0',
    buildChannel: 'stable'
  },
  users: []
};

