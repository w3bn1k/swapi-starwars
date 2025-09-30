'use client';

import React from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';

type TResponsiveContainer = {
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    disableGutters?: boolean;
    sx?: object;
}

export function ResponsiveContainer({
    children,
    maxWidth = 'lg',
    disableGutters = false,
    sx = {}
}: TResponsiveContainer) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Container
            maxWidth={maxWidth}
            disableGutters={disableGutters}
            sx={{
                px: isMobile ? 2 : isTablet ? 3 : 4,
                py: isMobile ? 2 : 3,
                ...sx,
            }}
        >
            {children}
        </Container>
    );
}
