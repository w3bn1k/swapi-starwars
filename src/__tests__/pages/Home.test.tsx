import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/utils/theme';
import Home from '@/app/page';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: () => false,
    useTheme: () => theme,
}));

jest.mock('@/hooks/useCharactersWithPagination', () => ({
    useCharactersWithPagination: () => ({
        characters: [
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
        loading: false,
        error: null,
        totalCount: 1,
        currentPage: 1,
        totalPages: 1,
        searchCharacters: jest.fn(),
        searchQuery: '',
        setPage: jest.fn(),
        updateCharacter: jest.fn(),
        deleteCharacter: jest.fn(),
        isCharacterEdited: jest.fn(),
    }),
}));

jest.mock('@/hooks/usePreloadData', () => ({
    usePreloadData: () => ({
        preloadCharacters: jest.fn(),
        preloadCharacterDetails: jest.fn(),
    }),
}));

jest.mock('@/components/CharacterSearch', () => ({
    CharacterSearch: function MockCharacterSearch() {
        return <div data-testid="character-search">Character Search</div>;
    },
}));

jest.mock('@/components/CharacterTableWithPagination', () => ({
    CharacterTableWithPagination: function MockCharacterTableWithPagination() {
        return <div data-testid="character-table">Character Table</div>;
    },
}));

jest.mock('@/components/PageTransition', () => ({
    PageTransition: function MockPageTransition({ children }: { children: React.ReactNode }) {
        return <div data-testid="page-transition">{children}</div>;
    },
}));

jest.mock('@/components/ResponsiveContainer', () => ({
    ResponsiveContainer: function MockResponsiveContainer({ children }: { children: React.ReactNode }) {
        return <div data-testid="responsive-container">{children}</div>;
    },
}));

jest.mock('@/components/MobileNavigation', () => ({
    MobileNavigation: function MockMobileNavigation() {
        return <div data-testid="mobile-navigation">Mobile Nav</div>;
    },
}));

jest.mock('@/components/ui/NotificationSnackbar', () => ({
    NotificationSnackbar: function MockNotificationSnackbar() {
        return <div data-testid="notification-snackbar">Notification</div>;
    },
}));

jest.mock('@/components/CharacterEditModal', () => ({
    CharacterEditModal: function MockCharacterEditModal() {
        return <div data-testid="character-edit-modal">Edit Modal</div>;
    },
}));

jest.mock('@/components/CharacterDeleteModal', () => ({
    CharacterDeleteModal: function MockCharacterDeleteModal() {
        return <div data-testid="character-delete-modal">Delete Modal</div>;
    },
}));

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

describe('Home', () => {
    it('renders welcome message', () => {
        renderWithTheme(<Home />);

        expect(screen.getByText(/Star Wars Characters/i)).toBeInTheDocument();
    });

    it('renders character search', () => {
        renderWithTheme(<Home />);

        expect(screen.getByTestId('character-search')).toBeInTheDocument();
    });

    it('renders character table', () => {
        renderWithTheme(<Home />);

        expect(screen.getByTestId('character-table')).toBeInTheDocument();
    });

    it('renders page transition', () => {
        renderWithTheme(<Home />);

        expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('renders mobile navigation', () => {
        renderWithTheme(<Home />);

        expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    });
});