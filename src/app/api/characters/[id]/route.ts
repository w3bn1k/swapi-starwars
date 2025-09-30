import { NextRequest, NextResponse } from 'next/server';
import type { Character } from '@/types/swapi';
import { ApiError } from '@/utils/errorHandler';

const SWAPI_BASE_URL = 'https://swapi.py4e.com/api';

async function fetchFromSwapi<T>(url: string, retries = 3): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 429 && attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
                throw new ApiError(
                    `HTTP error! status: ${response.status}`,
                    response.status,
                );
            }

            const data = await response.json();
            return data as T;
        } catch (error) {
            if (attempt === retries) {
                if (error instanceof ApiError) {
                    throw error;
                }

                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new ApiError('Network error: Unable to connect to SWAPI', 0);
                }

                throw new ApiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
            }

            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    throw new ApiError('Max retries exceeded', 500);
}

export async function GET(
    __request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Character ID is required' },
                { status: 400 }
            );
        }

        if (!/^\d+$/.test(id) || parseInt(id, 10) <= 0) {
            return NextResponse.json(
                { error: 'Invalid character ID' },
                { status: 400 }
            );
        }

        const url = `${SWAPI_BASE_URL}/people/${id}/`;
        const data = await fetchFromSwapi<Character>(url);

        const response = NextResponse.json(data);

        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');

        return response;
    } catch (error) {
        console.error('Error fetching character:', error);

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
