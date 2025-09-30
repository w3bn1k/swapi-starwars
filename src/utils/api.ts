import type {
    Character,
    CharacterResponse,
    PaginationParams,
} from '@/types/swapi';
import { ApiError, NetworkError, handleError } from './errorHandler';

const API_BASE_URL = '/api';

async function fetchApi<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.error || `HTTP error! status: ${response.status}`,
                response.status,
            );
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        throw handleError(error);
    }
}

export const extractCharacterId = (url: string): string => url.split('/').slice(-2, -1)[0] || '';

export const swapiApi = {
    async getCharacters(params?: PaginationParams): Promise<CharacterResponse> {
        const searchParams = new URLSearchParams();

        if (params?.page) {
            searchParams.set('page', params.page.toString());
        }

        if (params?.search) {
            searchParams.set('search', params.search);
        }

        const url = `${API_BASE_URL}/characters${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        return fetchApi<CharacterResponse>(url);
    },

    async getCharacter(id: string): Promise<Character> {
        const url = `${API_BASE_URL}/characters/${id}`;
        return fetchApi<Character>(url);
    },


    async getResourceByUrl<T>(url: string): Promise<T> {
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `${API_BASE_URL}/resource?url=${encodedUrl}`;
        return fetchApi<T>(apiUrl);
    },
};

export { ApiError, NetworkError, handleError };
