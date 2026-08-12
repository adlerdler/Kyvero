export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export const initialUsers: User[] = [
  {
    id: 'usr_admin_001',
    username: 'admin',
    password: 'admin123',
    name: '超级管理员',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Administrator',
    email: 'admin@example.com'
  }
];
