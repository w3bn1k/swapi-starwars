import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 1000;

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();

    const current = requestCounts.get(ip);

    if (!current || now > current.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
        current.count++;

        if (current.count > RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }
    }

    const response = NextResponse.next();

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
