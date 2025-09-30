import { swapiApi, extractCharacterId } from '@/utils/api';
import { ApiError, AppError } from '@/utils/errorHandler';

global.fetch = jest.fn();

const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.py4e.com/api/planets/1/',
    films: ['https://swapi.py4e.com/api/films/1/'],
    species: [],
    vehicles: [],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.py4e.com/api/people/1/',
};

const mockCharacterResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockCharacter],
};

describe('swapiApi', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    describe('getCharacters', () => {
        it('fetches characters successfully', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacterResponse,
            });

            const result = await swapiApi.getCharacters();

            expect(fetch).toHaveBeenCalledWith('/api/characters', {
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(mockCharacterResponse);
        });

        it('fetches characters with pagination', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacterResponse,
            });

            const result = await swapiApi.getCharacters({ page: 2 });

            expect(fetch).toHaveBeenCalledWith('/api/characters?page=2', {
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(mockCharacterResponse);
        });

        it('fetches characters with search', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacterResponse,
            });

            const result = await swapiApi.getCharacters({ search: 'luke' });

            expect(fetch).toHaveBeenCalledWith('/api/characters?search=luke', {
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(mockCharacterResponse);
        });

        it('fetches characters with both pagination and search', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacterResponse,
            });

            const result = await swapiApi.getCharacters({ page: 2, search: 'luke' });

            expect(fetch).toHaveBeenCalledWith('/api/characters?page=2&search=luke', {
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(mockCharacterResponse);
        });

        it('handles fetch error', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            await expect(swapiApi.getCharacters()).rejects.toThrow(AppError);
        });

        it('handles HTTP error response', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ error: 'Not found' }),
            });

            await expect(swapiApi.getCharacters()).rejects.toThrow(ApiError);
        });
    });

    describe('getCharacter', () => {
        it('fetches single character successfully', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacter,
            });

            const result = await swapiApi.getCharacter('1');

            expect(fetch).toHaveBeenCalledWith('/api/characters/1', {
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(mockCharacter);
        });

        it('handles character not found', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ error: 'Character not found' }),
            });

            await expect(swapiApi.getCharacter('999')).rejects.toThrow(ApiError);
        });
    });

    describe('getResourceByUrl', () => {
        it('fetches resource by URL successfully', async () => {
            const mockResource = { name: 'Tatooine', climate: 'arid' };
            const resourceUrl = 'https://swapi.py4e.com/api/planets/1/';

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResource,
            });

            const result = await swapiApi.getResourceByUrl(resourceUrl);

            expect(fetch).toHaveBeenCalledWith(
                `/api/resource?url=${encodeURIComponent(resourceUrl)}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            expect(result).toEqual(mockResource);
        });

        it('handles invalid URL', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Invalid URL'));

            await expect(swapiApi.getResourceByUrl('invalid-url')).rejects.toThrow(AppError);
        });

        it('handles fetch error for resource', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            await expect(swapiApi.getResourceByUrl('https://example.com')).rejects.toThrow(AppError);
        });
    });
});

describe('extractCharacterId', () => {
    it('extracts character ID from URL', () => {
        const url = 'https://swapi.py4e.com/api/people/1/';
        const id = extractCharacterId(url);
        expect(id).toBe('1');
    });

    it('returns empty string for invalid URL', () => {
        const url = 'invalid-url';
        const id = extractCharacterId(url);
        expect(id).toBe('');
    });
});