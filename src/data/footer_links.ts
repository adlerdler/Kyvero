import { FooterLink } from '../types';

export const initialFooterLinks: FooterLink[] = [
  { id: 'fl-1', name: 'GitHub Profile', url: 'https://github.com', iconType: 'github' },
  { id: 'fl-2', name: 'X / Twitter', url: 'https://x.com', iconType: 'twitter' },
  { id: 'fl-3', name: 'Contact Email', url: 'mailto:kaito.lin.dev@example.com', iconType: 'email' },
  { id: 'fl-4', name: 'Dev Blog', url: 'https://dev.to', iconType: 'blog' },
];

export default initialFooterLinks;
