import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback, useState } from 'react';
import { swapiApi, extractCharacterId } from '@/utils/api';
import { useCharacterStore } from '@/stores/characterStore';
import type { Character, CharacterWithDetails } from '@/types/swapi';


interface UseCharactersWithPaginationReturn {
    characters: CharacterWithDetails[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    searchQuery: string;
    searchCharacters: (query: string) => void;
    setPage: (page: number) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    isCharacterEdited: (id: string) => boolean;
    isCharacterDeleted: (id: string) => boolean;
}

const resourceCache = new Map<string, any>();

const fetchResource = async (url: string) => {
    if (resourceCache.has(url)) {
        return resourceCache.get(url);
    }

    try {
        const resource = await swapiApi.getResourceByUrl(url);
        resourceCache.set(url, resource);
        return resource;
    } catch (error) {
        console.warn(`Failed to fetch resource: ${url}`, error);
        return null;
    }
};

const enrichCharacter = async (character: Character): Promise<CharacterWithDetails> => {
    const [homeworld, films, species, vehicles, starships] = await Promise.all([
        fetchResource(character.homeworld),
        Promise.all(character.films.map(url => fetchResource(url))),
        Promise.all(character.species.map(url => fetchResource(url))),
        Promise.all(character.vehicles.map(url => fetchResource(url))),
        Promise.all(character.starships.map(url => fetchResource(url))),
    ]);

    return {
        ...character,
        homeworldDetails: homeworld,
        filmsDetails: films.filter(Boolean),
        speciesDetails: species.filter(Boolean),
        vehiclesDetails: vehicles.filter(Boolean),
        starshipsDetails: starships.filter(Boolean),
    };
};

export function useCharactersWithPagination(): UseCharactersWithPaginationReturn {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        editedCharacters,
        deletedCharacterIds,
        updateCharacter,
        deleteCharacter,
        isCharacterEdited,
        isCharacterDeleted,
    } = useCharacterStore();

    const {
        data: charactersData,
        isLoading: charactersLoading,
        error: charactersError,
    } = useQuery({
        queryKey: ['characters', searchQuery, currentPage],
        queryFn: async () => {
            if (searchQuery) {
                const response = await swapiApi.getCharacters({
                    page: 1,
                    search: searchQuery
                });
                return response;
            } else {
                const response = await swapiApi.getCharacters({ page: currentPage });
                return response;
            }
        },
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const {
        data: enrichedCharacters = [],
        isLoading: isEnriching,
        error: enrichmentError,
    } = useQuery({
        queryKey: ['characters-with-details', charactersData?.results],
        queryFn: async () => {
            if (!charactersData?.results) {
                return [];
            }

            const enriched = await Promise.all(
                charactersData.results.map((character: Character) => enrichCharacter(character))
            );

            console.log('Enriched characters:', enriched.length);
            return enriched;
        },
        enabled: !!charactersData?.results,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const processedCharacters = useMemo(() => {
        const allCharacters = enrichedCharacters
            .map((character: CharacterWithDetails) => {
                const id = extractCharacterId(character.url);
                if (!id) return character;

                const editedCharacter = editedCharacters.get(id);
                if (editedCharacter) {
                    return {
                        ...character,
                        ...editedCharacter,
                        homeworldDetails: character.homeworldDetails,
                        filmsDetails: character.filmsDetails,
                        speciesDetails: character.speciesDetails,
                        vehiclesDetails: character.vehiclesDetails,
                        starshipsDetails: character.starshipsDetails,
                    };
                }

                return character;
            })
            .filter((character: CharacterWithDetails) => {
                const id = extractCharacterId(character.url);
                return id ? !deletedCharacterIds.has(id) : true;
            });


        return allCharacters;
    }, [enrichedCharacters, editedCharacters, deletedCharacterIds, currentPage]);

    const searchCharacters = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const totalCount = charactersData?.count || 0;
    const totalPages = Math.ceil(totalCount / 10);
    const loading = charactersLoading || (isEnriching && enrichedCharacters.length === 0);
    const error = charactersError?.message || enrichmentError?.message || null;

    useQuery({
        queryKey: ['preload-characters', totalPages],
        queryFn: async () => {
            if (totalPages <= 1) return;

            const preloadPromises = [];
            for (let page = 2; page <= Math.min(totalPages, 5); page++) {
                preloadPromises.push(
                    swapiApi.getCharacters({ page }).then(response => {
                        console.log(`Preloaded page ${page}:`, response.results.length, 'characters');
                        return response;
                    })
                );
            }

            await Promise.all(preloadPromises);
        },
        enabled: !!totalPages && totalPages > 1,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return {
        characters: processedCharacters,
        loading,
        error,
        totalCount,
        currentPage,
        totalPages,
        searchQuery,
        searchCharacters,
        setPage,
        updateCharacter,
        deleteCharacter,
        isCharacterEdited,
        isCharacterDeleted,
    };
}
