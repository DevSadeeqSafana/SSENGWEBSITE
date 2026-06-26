import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

function canAccessAdmin(role?: string | null): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR';
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes are limited to staff roles.
    if (path.startsWith('/admin')) {
      if (!canAccessAdmin(token?.role as string | undefined)) {
        return NextResponse.redirect(new URL('/portal', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized returns true if the user has a valid token (is logged in)
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect admin and portal routes — public routes are open
export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
