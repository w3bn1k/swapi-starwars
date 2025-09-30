'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Home as HomeIcon,
    Movie as MovieIcon,
    DirectionsCar as VehicleIcon,
    Flight as StarshipIcon,
    Pets as SpeciesIcon,
} from '@mui/icons-material';
import { useCharactersWithPagination } from '@/hooks/useCharactersWithPagination';
import { usePreloadData } from '@/hooks/usePreloadData';
import { useCharacterStore } from '@/stores/characterStore';
import { CharacterEditModal } from '@/components/CharacterEditModal';
import { CharacterDeleteModal } from '@/components/CharacterDeleteModal';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { MobileNavigation } from '@/components/MobileNavigation';
import { NotificationSnackbar } from '@/components/ui/NotificationSnackbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { extractCharacterId } from '@/utils/api';
import type { CharacterWithDetails } from '@/types/swapi';

export default function CharacterPage() {
    const params = useParams();
    const router = useRouter();
    const characterId = params.id as string;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { characters, loading, error } = useCharactersWithPagination();
    const { updateCharacter, deleteCharacter, isCharacterEdited, getEditedCharacter } = useCharacterStore();
    const { preloadCharacterDetails } = usePreloadData();

    const character = useMemo(() =>
        characters.find(char => extractCharacterId(char.url) === characterId),
        [characters, characterId]
    );

    const isEdited = isCharacterEdited(characterId);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [localCharacter, setLocalCharacter] = useState<CharacterWithDetails | null>(null);

    useEffect(() => {
        if (character) {
            const editedCharacter = getEditedCharacter(characterId);
            if (editedCharacter) {
                setLocalCharacter({
                    ...character,
                    ...editedCharacter,
                    homeworldDetails: character.homeworldDetails,
                    filmsDetails: character.filmsDetails,
                    speciesDetails: character.speciesDetails,
                    vehiclesDetails: character.vehiclesDetails,
                    starshipsDetails: character.starshipsDetails,
                });
            } else {
                setLocalCharacter(character);
            }
        }
    }, [character, characterId, getEditedCharacter]);

    useEffect(() => {
        if (character && !character.homeworldDetails) {
            preloadCharacterDetails(character);
        }
    }, [character, preloadCharacterDetails]);


    const handleBack = useCallback((): void => {
        router.back();
    }, [router]);

    const handleEdit = useCallback((): void => {
        setIsEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((): void => {
        setIsDeleteModalOpen(true);
    }, []);

    const closeEditModal = useCallback((): void => {
        setIsEditModalOpen(false);
    }, []);

    const closeDeleteModal = useCallback((): void => {
        setIsDeleteModalOpen(false);
    }, []);

    const handleSaveEdit = useCallback((updatedCharacter: CharacterWithDetails): void => {
        updateCharacter(characterId, updatedCharacter);
        closeEditModal();
    }, [characterId, updateCharacter, closeEditModal]);

    const handleConfirmDelete = useCallback((): void => {
        deleteCharacter(characterId);
        closeDeleteModal();
        router.push('/');
    }, [characterId, deleteCharacter, closeDeleteModal, router]);


    if (loading && !character) {
        return <LoadingSpinner message="Loading character..." fullHeight />;
    }

    if (error) {
        return (
            <>
                <MobileNavigation title="Character Details" />
                <ResponsiveContainer sx={{ pt: isMobile ? 8 : 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            borderColor: '#FFD700',
                            color: '#FFD700',
                            '&:hover': {
                                borderColor: '#00BFFF',
                                color: '#00BFFF',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Go Back
                    </Button>
                </ResponsiveContainer>
            </>
        );
    }

    if (!localCharacter) {
        return (
            <>
                <MobileNavigation title="Character Details" />
                <ResponsiveContainer sx={{ pt: isMobile ? 8 : 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Character not found
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            borderColor: '#FFD700',
                            color: '#FFD700',
                            '&:hover': {
                                borderColor: '#00BFFF',
                                color: '#00BFFF',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Go Back
                    </Button>
                </ResponsiveContainer>
            </>
        );
    }


    return (
        <>
            <MobileNavigation title={localCharacter.name} />

            <ResponsiveContainer sx={{ pt: isMobile ? 8 : 4 }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={isMobile ? 1 : 2}
                    mb={isMobile ? 3 : 4}
                    flexDirection={isMobile ? 'column' : 'row'}
                    textAlign={isMobile ? 'center' : 'left'}
                >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                color: '#00BFFF',
                                '&:hover': {
                                    color: '#FFD700',
                                    boxShadow: '0 0 15px rgba(0, 191, 255, 0.5)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Avatar sx={{
                            bgcolor: 'primary.main',
                            width: isMobile ? 48 : 64,
                            height: isMobile ? 48 : 64
                        }}>
                            <PersonIcon fontSize={isMobile ? 'medium' : 'large'} />
                        </Avatar>
                        <Box flex={1}>
                            <Typography
                                variant={isMobile ? 'h4' : 'h3'}
                                component="h1"
                                gutterBottom
                                className="shimmer"
                                sx={{
                                    background: 'linear-gradient(45deg, #FFD700, #00BFFF, #FFD700)',
                                    backgroundSize: '200% 200%',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: 'shimmer 3s ease-in-out infinite',
                                    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                                }}
                            >
                                {localCharacter.name}
                            </Typography>
                            {isEdited && (
                                <Chip label="Edited Locally" color="warning" size="small" />
                            )}
                        </Box>
                    </Box>

                    {!isMobile && (
                        <Box display="flex" gap={1}>
                            <Tooltip title="Edit Character">
                                <IconButton
                                    onClick={handleEdit}
                                    sx={{
                                        color: '#00BFFF',
                                        '&:hover': {
                                            color: '#FFD700',
                                            boxShadow: '0 0 15px rgba(0, 191, 255, 0.5)',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Character">
                                <IconButton
                                    onClick={handleDelete}
                                    sx={{
                                        color: '#FF4444',
                                        '&:hover': {
                                            color: '#FF6666',
                                            boxShadow: '0 0 15px rgba(255, 68, 68, 0.5)',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                {isMobile && (
                    <Box display="flex" gap={1} justifyContent="center" mb={3}>
                        <Tooltip title="Edit Character">
                            <IconButton
                                onClick={handleEdit}
                                sx={{
                                    color: '#00BFFF',
                                    '&:hover': {
                                        color: '#FFD700',
                                        boxShadow: '0 0 15px rgba(0, 191, 255, 0.5)',
                                        transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Character">
                            <IconButton
                                onClick={handleDelete}
                                sx={{
                                    color: '#FF4444',
                                    '&:hover': {
                                        color: '#FF6666',
                                        boxShadow: '0 0 15px rgba(255, 68, 68, 0.5)',
                                        transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}

                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: '1fr',
                        md: 'repeat(2, 1fr)'
                    }}
                    gap={isMobile ? 2 : 4}
                >
                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Basic Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Height:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.height} cm
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Mass:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.mass} kg
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Hair Color:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.hair_color}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Skin Color:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.skin_color}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Eye Color:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.eye_color}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Birth Year:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.birth_year}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">
                                        Gender:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {localCharacter.gender}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Homeworld
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {localCharacter.homeworldDetails ? (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {localCharacter.homeworldDetails.name}
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Climate:</strong> {localCharacter.homeworldDetails.climate}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Terrain:</strong> {localCharacter.homeworldDetails.terrain}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Population:</strong> {localCharacter.homeworldDetails.population}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <HomeIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Loading homeworld details...
                                    </Typography>
                                    {loading && <CircularProgress size={16} />}
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Films
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {localCharacter.filmsDetails && localCharacter.filmsDetails.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={1}>
                                    {localCharacter.filmsDetails.map((film, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <MovieIcon color="action" fontSize="small" />
                                            <Typography variant="body2">
                                                {film.title} (Episode {film.episode_id})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MovieIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {loading ? 'Loading films...' : 'No films found'}
                                    </Typography>
                                    {loading && <CircularProgress size={16} />}
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Species
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {localCharacter.speciesDetails && localCharacter.speciesDetails.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={1}>
                                    {localCharacter.speciesDetails.map((species, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <SpeciesIcon color="action" fontSize="small" />
                                            <Typography variant="body2">
                                                {species.name} ({species.classification})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <SpeciesIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {loading ? 'Loading species...' : 'No species found'}
                                    </Typography>
                                    {loading && <CircularProgress size={16} />}
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Vehicles
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {localCharacter.vehiclesDetails && localCharacter.vehiclesDetails.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={1}>
                                    {localCharacter.vehiclesDetails.map((vehicle, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <VehicleIcon color="action" fontSize="small" />
                                            <Typography variant="body2">
                                                {vehicle.name} ({vehicle.vehicle_class})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <VehicleIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {loading ? 'Loading vehicles...' : 'No vehicles found'}
                                    </Typography>
                                    {loading && <CircularProgress size={16} />}
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    <Box>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h5" gutterBottom>
                                Starships
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {localCharacter.starshipsDetails && localCharacter.starshipsDetails.length > 0 ? (
                                <Box display="flex" flexDirection="column" gap={1}>
                                    {localCharacter.starshipsDetails.map((starship, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <StarshipIcon color="action" fontSize="small" />
                                            <Typography variant="body2">
                                                {starship.name} ({starship.starship_class})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <StarshipIcon color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {loading ? 'Loading starships...' : 'No starships found'}
                                    </Typography>
                                    {loading && <CircularProgress size={16} />}
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Box>

                <CharacterEditModal
                    character={localCharacter}
                    open={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleSaveEdit}
                />
                <CharacterDeleteModal
                    character={localCharacter}
                    open={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
                <NotificationSnackbar />
            </ResponsiveContainer>
        </>
    );
}
