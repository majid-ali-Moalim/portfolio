import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // If visiting login while already authenticated, redirect to /admin
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin-session')?.value;
    if (token) {
      const session = await verifySession(token);
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin-session')?.value;
    if (!token) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
      return response;
    }
    const session = await verifySession(token);
    if (!session) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
