import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Note: We can't access localStorage in middleware (server-side)
    // Auth check will be done client-side in the layout components
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    // Basic routing - actual auth check happens client-side
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
