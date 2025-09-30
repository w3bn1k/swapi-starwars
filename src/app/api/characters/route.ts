import { NextRequest, NextResponse } from 'next/server';
import type { CharacterResponse } from '@/types/swapi';
import { ApiError } from '@/utils/errorHandler';

const SWAPI_BASE_URL = 'https://swapi.py4e.com/api';

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
        const pageParam = searchParams.get('page');
        const search = searchParams.get('search') || '';

        const page = pageParam && !isNaN(Number(pageParam)) && Number(pageParam) > 0
            ? pageParam
            : '1';

        if (search.length > 100) {
            return NextResponse.json(
                { error: 'Search query too long' },
                { status: 400 }
            );
        }

        const params = new URLSearchParams();
        params.set('page', page);
        if (search) params.set('search', search);

        const url = `${SWAPI_BASE_URL}/people/?${params.toString()}`;
        const data = await fetchFromSwapi<CharacterResponse>(url);

        const response = NextResponse.json(data);

        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');

        return response;
    } catch (error) {
        console.error('Error fetching characters:', error);

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