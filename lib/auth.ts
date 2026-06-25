import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './queries/users';

const authUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'sse-default-nextauth-secret-change-me';

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = authUrl;
}

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = authSecret;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error('No user found with this email.');
        }

        if (user.membership_status === 'SUSPENDED') {
          throw new Error('Your account has been suspended. Please contact admin.');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isPasswordMatch) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id?.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          membership_number: user.membership_number,
          membership_status: user.membership_status,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.membership_number = user.membership_number;
        token.membership_status = user.membership_status;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.membership_number = token.membership_number;
        session.user.membership_status = token.membership_status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: authSecret,
};
