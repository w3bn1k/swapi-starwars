import React from 'react';
import { Box, Pagination as MuiPagination, Typography, CircularProgress } from '@mui/material';

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
    if (totalPages <= 1) {
        return <></>;
    }

    const startItem = (currentPage - 1) * 12 + 1;
    const endItem = Math.min(currentPage * 12, totalCount);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 3,
            py: 2
        }}>
            <Typography variant="body2" color="text.secondary">
                Showing {startItem}-{endItem} of {totalCount} characters
            </Typography>

            <Box sx={{ position: 'relative' }}>
                <MuiPagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => onPageChange(page)}
                    disabled={loading}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
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
