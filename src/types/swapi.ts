export interface Character {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
    species: string[];
    vehicles: string[];
    starships: string[];
    created: string;
    edited: string;
    url: string;
}

export interface CharacterResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Character[];
}

export interface Planet {
    name: string;
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
}

export interface Film {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
    created: string;
    edited: string;
    url: string;
}

export interface Species {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    homeworld: string | null;
    language: string;
    people: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
}

export interface Vehicle {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    vehicle_class: string;
    pilots: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
}

export interface Starship {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
    pilots: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
}

export interface ApiError {
    message: string;
    status?: number;
}

export interface PaginationParams {
    page: number;
    search?: string;
}

export interface CharacterFilters {
    search?: string;
    gender?: string;
    species?: string;
}

export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export interface PaginationState {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount: number;
}

export interface CharacterWithDetails extends Character {
    homeworldDetails?: Planet | undefined;
    filmsDetails?: Film[] | undefined;
    speciesDetails?: Species[] | undefined;
    vehiclesDetails?: Vehicle[] | undefined;
    starshipsDetails?: Starship[] | undefined;
}

export interface LocalCharacter extends Character {
    id: string;
    isEdited: boolean;
    lastModified: string;
}

export interface SearchState {
    query: string;
    results: Character[];
    isSearching: boolean;
    hasSearched: boolean;
}
