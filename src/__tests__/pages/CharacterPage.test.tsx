import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/utils/theme';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
    useParams: () => ({ id: '1' }),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useMediaQuery: () => false,
    useTheme: () => theme,
}));

jest.mock('@/hooks/useCharactersWithPagination', () => ({
    useCharactersWithPagination: () => ({
        characters: [],
        loading: false,
        error: null,
    }),
}));

jest.mock('@/hooks/usePreloadData', () => ({
    usePreloadData: () => ({
        preloadCharacterDetails: jest.fn(),
    }),
}));

jest.mock('@/stores/characterStore', () => ({
    useCharacterStore: () => ({
        updateCharacter: jest.fn(),
        deleteCharacter: jest.fn(),
        isCharacterEdited: jest.fn(() => false),
        getEditedCharacter: jest.fn(() => null),
    }),
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

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});


describe('CharacterPage', () => {
    it('should be importable', () => {
        expect(() => {
            require('@/app/character/[id]/page');
        }).not.toThrow();
    });

    it('should have correct exports', () => {
        const CharacterPage = require('@/app/character/[id]/page').default;
        expect(typeof CharacterPage).toBe('function');
    });
});
