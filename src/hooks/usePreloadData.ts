import { useQueryClient } from '@tanstack/react-query';
import { swapiApi } from '@/utils/api';
import type { Character } from '@/types/swapi';

export function usePreloadData() {
    const queryClient = useQueryClient();

    const preloadCharacters = async () => {
        const queryKey = ['characters', ''];

        if (queryClient.getQueryData(queryKey)) {
            return;
        }

        try {
            const allCharacters: Character[] = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await swapiApi.getCharacters({ page });
                allCharacters.push(...response.results);

                hasMore = response.next !== null;
                page++;
            }

            const charactersData = {
                count: allCharacters.length,
                next: null,
                previous: null,
                results: allCharacters
            };

            queryClient.setQueryData(queryKey, charactersData);
        } catch (error) {
            console.warn('Failed to preload characters:', error);
        }
    };

    const preloadCharacterDetails = async (character: Character) => {
        const queryKey = ['character-details', character.url];

        if (queryClient.getQueryData(queryKey)) {
            return;
        }

        try {
            const [homeworld, films, species, vehicles, starships] = await Promise.all([
                character.homeworld ? swapiApi.getResourceByUrl(character.homeworld) : null,
                Promise.all(character.films.map(url => swapiApi.getResourceByUrl(url))),
                Promise.all(character.species.map(url => swapiApi.getResourceByUrl(url))),
                Promise.all(character.vehicles.map(url => swapiApi.getResourceByUrl(url))),
                Promise.all(character.starships.map(url => swapiApi.getResourceByUrl(url))),
            ]);

            const enrichedCharacter = {
                ...character,
                homeworldDetails: homeworld,
                filmsDetails: films.filter(Boolean),
                speciesDetails: species.filter(Boolean),
                vehiclesDetails: vehicles.filter(Boolean),
                starshipsDetails: starships.filter(Boolean),
            };

            queryClient.setQueryData(queryKey, enrichedCharacter);
        } catch (error) {
            console.warn('Failed to preload character details:', error);
        }
    };

    return {
        preloadCharacters,
        preloadCharacterDetails,
    };
}
