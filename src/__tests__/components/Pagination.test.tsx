import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';
import { Pagination } from '@/components/Pagination';

const mockOnPageChange = jest.fn();

const Tdefault = {
    currentPage: 2,
    totalPages: 5,
    totalCount: 50,
    onPageChange: mockOnPageChange,
    loading: false,
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('Pagination', () => {
    beforeEach(() => {
        mockOnPageChange.mockClear();
    });

    it('renders pagination info', () => {
        renderWithTheme(<Pagination {...Tdefault} />);

        expect(screen.getByText('Showing 13-24 of 50 characters')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
        renderWithTheme(<Pagination {...Tdefault} />);

        expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
        expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    });

    it('does not render when totalPages is 1 or less', () => {
        const { container } = renderWithTheme(
            <Pagination {...Tdefault} totalPages={1} />
        );

        expect(container.firstChild).toBeNull();
    });

    it('handles page navigation', () => {
        renderWithTheme(<Pagination {...Tdefault} />);

        const nextButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('shows loading state', () => {
        renderWithTheme(<Pagination {...Tdefault} loading={true} />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});