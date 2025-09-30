import React from 'react';
import { Box, Pagination as MuiPagination, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';

type TPagination = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    loading = false
}: TPagination) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (totalPages <= 1) {
        return <></>;
    }

    const startItem = (currentPage - 1) * 12 + 1;
    const endItem = Math.min(currentPage * 12, totalCount);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 1 : 2,
            mt: 3,
            py: 2,
            flexWrap: 'nowrap',
            overflow: 'hidden'
        }}>
            <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                    flexShrink: 0,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    minWidth: 0
                }}
            >
                Showing {startItem}-{endItem} of {totalCount} characters
            </Typography>

            <Box sx={{ 
                position: 'relative',
                flexShrink: 0,
                minWidth: 0,
                width: isMobile ? '100%' : 'auto'
            }}>
                <MuiPagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => onPageChange(page)}
                    disabled={loading}
                    color="primary"
                    size={isMobile ? "small" : "large"}
                    showFirstButton={!isMobile}
                    showLastButton={!isMobile}
                    siblingCount={isMobile ? 0 : 1}
                    boundaryCount={isMobile ? 1 : 1}
                    sx={{
                        '& .MuiPagination-ul': {
                            flexWrap: 'nowrap',
                            justifyContent: 'center'
                        }
                    }}
                />
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
