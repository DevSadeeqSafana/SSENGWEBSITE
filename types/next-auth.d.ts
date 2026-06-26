import { DefaultSession, DefaultUser } from 'next-auth';

type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'MEMBER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      membership_number?: string | null;
      membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: AppRole;
    membership_number?: string | null;
    membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: AppRole;
    membership_number?: string | null;
    membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  }
}
