'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

type TLoadingSpinner = {
    size?: number;
    message?: string;
    fullHeight?: boolean;
}

export function LoadingSpinner({
    size = 40,
    message = 'Loading...',
    fullHeight = false
}: TLoadingSpinner) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                ...(fullHeight && { height: '100vh' }),
                p: 3,
            }}
        >
            <CircularProgress
                size={size}
                sx={{
                    color: '#FFD700',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                }}
            />
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                        letterSpacing: '0.1em',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

type TSkeletonCard = {
    count?: number;
}

export function SkeletonCard({ count = 1 }: TSkeletonCard) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" width="80%" height={32} />
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                </Box>
            ))}
        </>
    );
}

type TLoadingOverlay = {
    open: boolean;
    message?: string;
}

export function LoadingOverlay({ open, message = 'Loading...' }: TLoadingOverlay) {
    if (!open) return <></>;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
                    borderRadius: 2,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                }}
            >
                <CircularProgress
                    sx={{
                        color: '#FFD700',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                    }}
                />
                <Typography
                    variant="body1"
                    sx={{
                        color: '#FFD700',
                        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                        letterSpacing: '0.1em',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </Box>
    );
}

