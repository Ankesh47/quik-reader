import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Paths that require auth
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/practice/')) {

        // Allow /practice/free without auth if desired, but user asked for account to practice.
        // Let's protect everything for now as per "on entering the app... crate account"

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            // Invalid token
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Role check for admin
        if (request.nextUrl.pathname.startsWith('/admin')) {
            const userPayload = payload as { role?: string };
            if (userPayload.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    // Redirect logged-in users away from auth pages
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
        if (token && await verifyToken(token)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register', '/practice/:path*'],
};
