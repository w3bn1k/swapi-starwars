'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, CircularProgress, Button, useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';

type TCharacterSearch = {
    onSearch: (query: string) => void;
    searchQuery: string;
    loading?: boolean;
    onResetData?: () => void;
}

export function CharacterSearch({
    onSearch,
    searchQuery,
    loading = false,
    onResetData
}: TCharacterSearch) {
    const [inputValue, setInputValue] = useState(searchQuery);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <Box sx={{ mb: 4, maxWidth: isMobile ? '100%' : 800, mx: 'auto' }} className="fade-in-up">
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    mb: 2,
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                    letterSpacing: '0.1em',
                }}
            >
                SEARCH CHARACTERS
            </Typography>
            
            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type to search characters..."
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        {loading ? (
                                            <CircularProgress
                                                size={20}
                                                sx={{
                                                    color: '#FFD700',
                                                    '& .MuiCircularProgress-circle': {
                                                        strokeLinecap: 'round',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <SearchIcon
                                                sx={{
                                                    color: '#00BFFF',
                                                    filter: 'drop-shadow(0 0 4px rgba(0, 191, 255, 0.5))',
                                                }}
                                            />
                                        )}
                                    </Box>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '16px',
                                    minHeight: '56px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 215, 0, 0.3)',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 215, 0, 0.6)',
                                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFD700',
                                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#FFD700',
                                    '&::placeholder': {
                                        color: 'rgba(255, 215, 0, 0.6)',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                    </Box>
                    {onResetData && (
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={onResetData}
                            disabled={loading}
                            sx={{
                                minHeight: '56px',
                                borderColor: '#FF4444',
                                color: '#FF4444',
                                '&:hover': {
                                    borderColor: '#FF6666',
                                    color: '#FF6666',
                                    boxShadow: '0 0 15px rgba(255, 68, 68, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    borderColor: 'rgba(255, 68, 68, 0.3)',
                                    color: 'rgba(255, 68, 68, 0.3)',
                                },
                                transition: 'all 0.3s ease',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Reset Data
                        </Button>
                    )}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ position: 'relative', flex: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type to search characters..."
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        {loading ? (
                                            <CircularProgress
                                                size={20}
                                                sx={{
                                                    color: '#FFD700',
                                                    '& .MuiCircularProgress-circle': {
                                                        strokeLinecap: 'round',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <SearchIcon
                                                sx={{
                                                    color: '#00BFFF',
                                                    filter: 'drop-shadow(0 0 4px rgba(0, 191, 255, 0.5))',
                                                }}
                                            />
                                        )}
                                    </Box>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '16px',
                                    minHeight: '56px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 215, 0, 0.3)',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 215, 0, 0.6)',
                                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFD700',
                                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#FFD700',
                                    '&::placeholder': {
                                        color: 'rgba(255, 215, 0, 0.6)',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                    </Box>
                    {onResetData && (
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={onResetData}
                            disabled={loading}
                            sx={{
                                minHeight: '56px',
                                borderColor: '#FF4444',
                                color: '#FF4444',
                                '&:hover': {
                                    borderColor: '#FF6666',
                                    color: '#FF6666',
                                    boxShadow: '0 0 15px rgba(255, 68, 68, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    borderColor: 'rgba(255, 68, 68, 0.3)',
                                    color: 'rgba(255, 68, 68, 0.3)',
                                },
                                transition: 'all 0.3s ease',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Reset Data
                        </Button>
                    )}
                </Box>
            )}
            {searchQuery && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        textAlign: 'center',
                        textShadow: '0 0 5px rgba(0, 191, 255, 0.5)',
                    }}
                >
                    Showing results for: "{searchQuery}"
                </Typography>
            )}
        </Box>
    );
}
