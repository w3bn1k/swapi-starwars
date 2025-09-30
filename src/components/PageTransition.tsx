import React from 'react';
import { Fade, Box } from '@mui/material';

type TPageTransition = {
    children: React.ReactNode;
    isLoading?: boolean;
}

export function PageTransition({ children, isLoading = false }: TPageTransition) {
    return (
        <Fade in={!isLoading} timeout={300}>
            <Box>
                {children}
            </Box>
        </Fade>
    );
}
