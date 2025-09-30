import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCharactersWithPagination } from '@/hooks/useCharactersWithPagination';
import { swapiApi } from '@/utils/api';

jest.mock('@/utils/api', () => ({
    swapiApi: {
        getCharacters: jest.fn(),
        getResourceByUrl: jest.fn(),
    },
    extractCharacterId: (url: string) => url.split('/').slice(-2, -1)[0] || '',
}));

jest.mock('@/stores/characterStore', () => ({
    useCharacterStore: () => ({
        editedCharacters: new Map(),
        deletedCharacterIds: new Set(),
    }),
}));

const mockSwapiApi = swapiApi as jest.Mocked<typeof swapiApi>;

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
    );
};

describe('useCharactersWithPagination', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch characters successfully', async () => {
        const mockCharacters = [
            {
                name: 'Luke Skywalker',
                height: '172',
                mass: '77',
                hair_color: 'blond',
                skin_color: 'fair',
                eye_color: 'blue',
                birth_year: '19BBY',
                gender: 'male',
                homeworld: 'https://swapi.py4e.com/api/planets/1/',
                films: [],
                species: [],
                vehicles: [],
                starships: [],
                created: '2014-12-09T13:50:51.644000Z',
                edited: '2014-12-20T21:17:56.891000Z',
                url: 'https://swapi.py4e.com/api/people/1/',
            },
        ];

        mockSwapiApi.getCharacters.mockResolvedValue({
            count: 1,
            next: null,
            previous: null,
            results: mockCharacters,
        });

        const { result } = renderHook(() => useCharactersWithPagination(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.characters).toHaveLength(1);
        expect(result.current.characters[0].name).toBe('Luke Skywalker');
        expect(result.current.totalCount).toBe(1);
    });

    it('should handle search', async () => {
        const mockCharacters = [
            {
                name: 'Luke Skywalker',
                height: '172',
                mass: '77',
                hair_color: 'blond',
                skin_color: 'fair',
                eye_color: 'blue',
                birth_year: '19BBY',
                gender: 'male',
                homeworld: 'https://swapi.py4e.com/api/planets/1/',
                films: [],
                species: [],
                vehicles: [],
                starships: [],
                created: '2014-12-09T13:50:51.644000Z',
                edited: '2014-12-20T21:17:56.891000Z',
                url: 'https://swapi.py4e.com/api/people/1/',
            },
        ];

        mockSwapiApi.getCharacters.mockResolvedValue({
            count: 1,
            next: null,
            previous: null,
            results: mockCharacters,
        });

        const { result } = renderHook(() => useCharactersWithPagination(), { wrapper });

        act(() => {
            result.current.searchCharacters('Luke');
        });

        await waitFor(() => {
            expect(mockSwapiApi.getCharacters).toHaveBeenCalledWith({
                page: 1,
                search: 'Luke',
            });
        });
    });

    it('should handle pagination', async () => {
        const mockCharacters = Array.from({ length: 25 }, (_, i) => ({
            name: `Character ${i + 1}`,
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.py4e.com/api/planets/1/',
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: `https://swapi.py4e.com/api/people/${i + 1}/`,
        }));

        mockSwapiApi.getCharacters.mockResolvedValue({
            count: 25,
            next: null,
            previous: null,
            results: mockCharacters,
        });

        const { result } = renderHook(() => useCharactersWithPagination(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.totalPages).toBe(3);
        expect(result.current.characters).toHaveLength(12);

        act(() => {
            result.current.setPage(2);
        });

        await waitFor(() => {
            expect(result.current.currentPage).toBe(2);
        });
    });

    it('should handle errors', async () => {
        mockSwapiApi.getCharacters.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useCharactersWithPagination(), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBe('API Error');
        });

        expect(result.current.loading).toBe(false);
    });
});
