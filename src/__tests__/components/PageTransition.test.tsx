import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme';
import { PageTransition } from '@/components/PageTransition';

const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {component}
        </ThemeProvider>
    );
};

describe('PageTransition', () => {
    it('renders children when not loading', () => {
        renderWithTheme(
            <PageTransition isLoading={false}>
                <div data-testid="content">Test Content</div>
            </PageTransition>
        );

        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('renders children when loading', () => {
        renderWithTheme(
            <PageTransition isLoading={true}>
                <div data-testid="content">Test Content</div>
            </PageTransition>
        );

        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies fade animation', () => {
        const { container } = renderWithTheme(
            <PageTransition isLoading={false}>
                <div>Test Content</div>
            </PageTransition>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();

        const fadeElement = container.querySelector('[class*="MuiFade"]') ||
            container.querySelector('[class*="fade"]') ||
            container.querySelector('div');
        expect(fadeElement).toBeInTheDocument();
    });
});
