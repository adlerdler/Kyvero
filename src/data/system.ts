import { FooterLink, SystemConfig } from '../types';

export const initialSystemConfig: SystemConfig = {
  siteTitle: 'A1L 极客工程作品集 // MECHA CYBER PORTFOLIO',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  iconUrl: '/favicon.ico',
  copyrightText: '© 2026 A1L MECHA SYSTEM. ALL RIGHTS RESERVED.',
  copyrightSubtext: 'A1L GEEK ENGINEERING // HARDCORE LINE ART ARCHITECTURE',
  version: 'v2.5.0-RELEASE',
  buildChannel: 'PRODUCTION-STABLE-CHANNEL',
  footerLinks: [
    { id: 'fl-1', name: 'GitHub Profile', url: 'https://github.com', iconType: 'github' },
    { id: 'fl-2', name: 'X / Twitter', url: 'https://x.com', iconType: 'twitter' },
    { id: 'fl-3', name: 'Contact Email', url: 'mailto:kaito.lin.dev@example.com', iconType: 'email' },
    { id: 'fl-4', name: 'Dev Blog', url: 'https://dev.to', iconType: 'blog' },
  ]
};

export const initialFooterLinks: FooterLink[] = initialSystemConfig.footerLinks;

