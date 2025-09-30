import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/utils/errorHandler';

async function fetchFromSwapi<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new ApiError(
                `HTTP error! status: ${response.status}`,
                response.status,
            );
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError('Network error: Unable to connect to SWAPI', 0);
        }

        throw new ApiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
}

export async function GET(_request: NextRequest) {
    try {
        const { searchParams } = new URL(_request.url);
        const resourceUrl = searchParams.get('url');

        if (!resourceUrl) {
            return NextResponse.json(
                { error: 'Resource URL is required' },
                { status: 400 }
            );
        }

        const data = await fetchFromSwapi(resourceUrl);

        const response = NextResponse.json(data);

        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');

        return response;
    } catch (error) {
        console.error('Error fetching resource:', error);

        if (error instanceof ApiError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode || 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}