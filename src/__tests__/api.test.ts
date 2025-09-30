import { swapiApi, extractCharacterId } from '@/utils/api';

global.fetch = jest.fn();

describe('SWAPI API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches characters', async () => {
        const mockResponse = {
            results: [
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
            ],
            count: 1,
            next: null,
            previous: null,
        };

        jest.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const result = await swapiApi.getCharacters({ page: 1 });

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
            '/api/characters?page=1',
            expect.any(Object)
        );
    });

    it('fetches single character', async () => {
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
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.py4e.com/api/people/1/',
        };

        jest.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCharacter,
        } as Response);

        const result = await swapiApi.getCharacter('1');

        expect(result).toEqual(mockCharacter);
        expect(fetch).toHaveBeenCalledWith(
            '/api/characters/1',
            expect.any(Object)
        );
    });

    it('handles API errors', async () => {
        jest.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ error: 'Character not found' }),
        } as Response);

        await expect(swapiApi.getCharacter('999')).rejects.toThrow('Character not found');
    });

    it('extracts character ID from URL', () => {
        expect(extractCharacterId('https://swapi.py4e.com/api/people/1/')).toBe('1');
        expect(extractCharacterId('https://swapi.py4e.com/api/people/42/')).toBe('42');
        expect(extractCharacterId('invalid-url')).toBe('');
    });
});