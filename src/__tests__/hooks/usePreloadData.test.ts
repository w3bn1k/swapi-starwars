import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePreloadData } from '@/hooks/usePreloadData';
import { swapiApi } from '@/utils/api';

jest.mock('@/utils/api', () => ({
    swapiApi: {
        getCharacters: jest.fn(),
        getResourceByUrl: jest.fn(),
    },
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

describe('usePreloadData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should preload characters', async () => {
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

        const { result } = renderHook(() => usePreloadData(), { wrapper });

        await result.current.preloadCharacters();

        expect(mockSwapiApi.getCharacters).toHaveBeenCalledWith({ page: 1 });
    });

    it('should preload character details', async () => {
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
            species: ['https://swapi.py4e.com/api/species/1/'],
            vehicles: ['https://swapi.py4e.com/api/vehicles/1/'],
            starships: ['https://swapi.py4e.com/api/starships/1/'],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.py4e.com/api/people/1/',
        };

        mockSwapiApi.getResourceByUrl
            .mockResolvedValueOnce({ name: 'Tatooine' })
            .mockResolvedValueOnce({ title: 'A New Hope' })
            .mockResolvedValueOnce({ name: 'Human' })
            .mockResolvedValueOnce({ name: 'Snowspeeder' })
            .mockResolvedValueOnce({ name: 'X-wing' });

        const { result } = renderHook(() => usePreloadData(), { wrapper });

        await result.current.preloadCharacterDetails(mockCharacter);

        expect(mockSwapiApi.getResourceByUrl).toHaveBeenCalledWith('https://swapi.py4e.com/api/planets/1/');
        expect(mockSwapiApi.getResourceByUrl).toHaveBeenCalledWith('https://swapi.py4e.com/api/films/1/');
        expect(mockSwapiApi.getResourceByUrl).toHaveBeenCalledWith('https://swapi.py4e.com/api/species/1/');
        expect(mockSwapiApi.getResourceByUrl).toHaveBeenCalledWith('https://swapi.py4e.com/api/vehicles/1/');
        expect(mockSwapiApi.getResourceByUrl).toHaveBeenCalledWith('https://swapi.py4e.com/api/starships/1/');
    });

    it('should handle preload errors gracefully', async () => {
        mockSwapiApi.getCharacters.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => usePreloadData(), { wrapper });

        await result.current.preloadCharacters();

        expect(mockSwapiApi.getCharacters).toHaveBeenCalled();
    });
});
