import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'EDITOR' | 'MEMBER';
      membership_number?: string | null;
      membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'ADMIN' | 'EDITOR' | 'MEMBER';
    membership_number?: string | null;
    membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'EDITOR' | 'MEMBER';
    membership_number?: string | null;
    membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  }
}
