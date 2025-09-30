import React from 'react';
import { Box, Pagination as MuiPagination, CircularProgress, useMediaQuery, useTheme } from '@mui/material';

type TPagination = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    loading = false
}: TPagination) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (totalPages <= 1) {
        return <></>;
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
            py: 2,
        }}>
            <Box sx={{
                position: 'relative',
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
