import { VisitorLogEntry } from '../types';

export const initialAnalytics: VisitorLogEntry[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    timestamp: '2026-08-11T08:00:00Z',
    path: '/',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ipHash: 'ip_839210475'
  },
  {
    id: 'f9e8d7c6-b5a4-3210-9876-543210fedcba',
    timestamp: '2026-08-11T09:30:00Z',
    path: '/admin',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    referrer: 'https://google.com',
    ipHash: 'ip_129384756'
  }
];
