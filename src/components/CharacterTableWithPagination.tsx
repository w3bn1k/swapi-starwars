import React, { useCallback } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Chip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { Pagination } from './Pagination';
import { usePreloadData } from '@/hooks/usePreloadData';
import { extractCharacterId } from '@/utils/api';
import type { CharacterWithDetails } from '@/types/swapi';

type TCharacterTableWithPagination = {
    characters: CharacterWithDetails[];
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onCharacterSelect?: (character: CharacterWithDetails) => void;
    onEdit?: (character: CharacterWithDetails) => void;
    onDelete?: (character: CharacterWithDetails) => void;
    isCharacterEdited?: (id: string) => boolean;
}

const CharacterRow = React.memo(({
    character,
    onCharacterSelect,
    onEdit,
    onDelete,
    isCharacterEdited,
    isMobile
}: {
    character: CharacterWithDetails;
    onCharacterSelect: ((character: CharacterWithDetails) => void) | undefined;
    onEdit: ((character: CharacterWithDetails) => void) | undefined;
    onDelete: ((character: CharacterWithDetails) => void) | undefined;
    isCharacterEdited: ((id: string) => boolean) | undefined;
    isMobile: boolean;
}) => {
    const characterId = extractCharacterId(character.url);
    const isEdited = characterId ? isCharacterEdited?.(characterId) || false : false;
    const { preloadCharacterDetails } = usePreloadData();

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(character);
    }, [character, onEdit]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(character);
    }, [character, onDelete]);

    const handleSelect = useCallback(() => {
        onCharacterSelect?.(character);
    }, [character, onCharacterSelect]);

    const handleMouseEnter = useCallback(() => {
        if (!character.homeworldDetails) {
            preloadCharacterDetails(character);
        }
    }, [character, preloadCharacterDetails]);

    return (
        <TableRow
            hover
            sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                    transform: 'translateX(4px)',
                },
            }}
            onClick={handleSelect}
            onMouseEnter={handleMouseEnter}
        >
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                        title={character.name}
                    >
                        {character.name}
                    </Typography>
                    {isEdited && (
                        <Chip
                            label="Edited"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ flexShrink: 0 }}
                        />
                    )}
                </Box>
            </TableCell>
            {!isMobile && (
                <TableCell>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={character.filmsDetails?.map(film => film.title).join(', ') || 'N/A'}
                    >
                        {character.filmsDetails?.map(film => film.title).join(', ') || 'N/A'}
                    </Typography>
                </TableCell>
            )}
            <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Character">
                        <IconButton
                            size="small"
                            onClick={handleEdit}
                            sx={{
                                color: '#00BFFF',
                                '&:hover': {
                                    color: '#FFD700',
                                    boxShadow: '0 0 10px rgba(0, 191, 255, 0.5)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Character">
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            sx={{
                                color: '#FF4444',
                                '&:hover': {
                                    color: '#FF6666',
                                    boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
        </TableRow>
    );
});

CharacterRow.displayName = 'CharacterRow';

export function CharacterTableWithPagination({
    characters,
    loading = false,
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    onCharacterSelect,
    onEdit,
    onDelete,
    isCharacterEdited,
}: TCharacterTableWithPagination) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 200, gap: 2 }}>
                <CircularProgress size={40} />
                <Typography variant="h6" color="text.secondary">
                    Loading characters...
                </Typography>
            </Box>
        );
    }

    if (characters.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    No characters found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Try adjusting your search criteria or check back later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 600,
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        width: '100%',
                        tableLayout: 'fixed',
                        '& .MuiTableCell-root': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 0,
                        },
                        '& .MuiTableCell-root:first-of-type': {
                            width: isMobile ? '70%' : '25%',
                        },
                        '& .MuiTableCell-root:nth-of-type(2)': {
                            width: isMobile ? '30%' : '60%',
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            width: isMobile ? '30%' : '15%',
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            {!isMobile && (
                                <TableCell sx={{ fontWeight: 'bold' }}>Films</TableCell>
                            )}
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characters.map((character) => (
                            <CharacterRow
                                key={character.url}
                                character={character}
                                onCharacterSelect={onCharacterSelect}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isCharacterEdited={isCharacterEdited}
                                isMobile={isMobile}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={onPageChange}
                loading={loading}
            />
        </Box>
    );
}
