import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/utils/theme';
import { CharacterTableWithPagination } from '@/components/CharacterTableWithPagination';

jest.mock('@/hooks/usePreloadData', () => ({
    usePreloadData: () => ({
        preloadCharacterDetails: jest.fn(),
    }),
}));

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
    {
        name: 'Leia Organa',
        height: '150',
        mass: '49',
        hair_color: 'brown',
        skin_color: 'light',
        eye_color: 'brown',
        birth_year: '19BBY',
        gender: 'female',
        homeworld: 'https://swapi.py4e.com/api/planets/2/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-10T15:20:09.791000Z',
        edited: '2014-12-20T21:17:50.315000Z',
        url: 'https://swapi.py4e.com/api/people/5/',
    },
];

const Tdefault = {
    characters: mockCharacters,
    loading: false,
    currentPage: 1,
    totalPages: 1,
    totalCount: 2,
    onPageChange: jest.fn(),
    onCharacterSelect: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    isCharacterEdited: jest.fn(() => false),
};

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithTheme = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                {component}
            </ThemeProvider>
        </QueryClientProvider>
    );
};

describe('CharacterTableWithPagination', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders character table', () => {
        renderWithTheme(<CharacterTableWithPagination {...Tdefault} />);

        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
        expect(screen.getByText('Leia Organa')).toBeInTheDocument();
    });

    it('renders pagination', () => {
        const propsWithPagination = {
            ...Tdefault,
            totalPages: 2,
            totalCount: 24,
        };
        renderWithTheme(<CharacterTableWithPagination {...propsWithPagination} />);
        expect(screen.getByText('Showing 1-12 of 24 characters')).toBeInTheDocument();
    });

    it('handles character selection', () => {
        const mockOnCharacterSelect = jest.fn();
        renderWithTheme(
            <CharacterTableWithPagination
                {...Tdefault}
                onCharacterSelect={mockOnCharacterSelect}
            />
        );

        fireEvent.click(screen.getByText('Luke Skywalker'));
        expect(mockOnCharacterSelect).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('handles edit action', () => {
        const mockOnEdit = jest.fn();
        renderWithTheme(
            <CharacterTableWithPagination
                {...Tdefault}
                onEdit={mockOnEdit}
            />
        );

        const editButton = screen.getAllByLabelText('Edit Character')[0];
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('handles delete action', () => {
        const mockOnDelete = jest.fn();
        renderWithTheme(
            <CharacterTableWithPagination
                {...Tdefault}
                onDelete={mockOnDelete}
            />
        );

        const deleteButton = screen.getAllByLabelText('Delete Character')[0];
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('shows loading state', () => {
        renderWithTheme(
            <CharacterTableWithPagination
                {...Tdefault}
                loading={true}
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows edited indicator', () => {
        const mockIsCharacterEdited = jest.fn((id) => id === '1');
        renderWithTheme(
            <CharacterTableWithPagination
                {...Tdefault}
                isCharacterEdited={mockIsCharacterEdited}
            />
        );

        expect(screen.getByText('Edited')).toBeInTheDocument();
    });
});
