'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Chip,
    Paper,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';
import type { CharacterWithDetails } from '@/types/swapi';

type TCharacterEditModal = {
    character: CharacterWithDetails | null;
    open: boolean;
    onClose: () => void;
    onSave?: (updatedCharacter: CharacterWithDetails) => void;
}

export function CharacterEditModal({ character, open, onClose, onSave }: TCharacterEditModal) {
    const { addSuccessNotification, addErrorNotification } = useNotifications();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState<Partial<CharacterWithDetails>>({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (character && open) {
            setFormData(character);
            setIsDirty(false);
        }
    }, [character, open]);

    const handleInputChange = (field: keyof CharacterWithDetails) => (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = (): void => {
        if (!character) return;

        try {
            const updatedCharacter = { ...character, ...formData } as CharacterWithDetails;
            onSave?.(updatedCharacter);
            addSuccessNotification('Character updated successfully');
        } catch (error) {
            addErrorNotification('Failed to update character');
        }
    };

    const handleCancel = (): void => {
        setFormData(character || {});
        setIsDirty(false);
        onClose();
    };

    const handleClose = (): void => {
        if (isDirty) {
            handleCancel();
        } else {
            onClose();
        }
    };

    if (!character) return <></>;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { minHeight: '80vh' }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Edit Character</Typography>
                    {isDirty && (
                        <Chip
                            label="Unsaved changes"
                            color="warning"
                            size="small"
                        />
                    )}
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Basic Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange('name')}
                                    sx={{ minWidth: '200px', flex: 1 }}
                                />
                                <TextField
                                    label="Height"
                                    value={formData.height || ''}
                                    onChange={handleInputChange('height')}
                                    sx={{ minWidth: '200px', flex: 1 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Mass"
                                    value={formData.mass || ''}
                                    onChange={handleInputChange('mass')}
                                    sx={{ minWidth: '200px', flex: 1 }}
                                />
                                <TextField
                                    label="Birth Year"
                                    value={formData.birth_year || ''}
                                    onChange={handleInputChange('birth_year')}
                                    sx={{ minWidth: '200px', flex: 1 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Gender"
                                    value={formData.gender || ''}
                                    onChange={handleInputChange('gender')}
                                    sx={{ minWidth: '200px', flex: 1 }}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Physical Appearance
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Hair Color"
                                value={formData.hair_color || ''}
                                onChange={handleInputChange('hair_color')}
                                sx={{ minWidth: '200px', flex: 1 }}
                            />
                            <TextField
                                label="Skin Color"
                                value={formData.skin_color || ''}
                                onChange={handleInputChange('skin_color')}
                                sx={{ minWidth: '200px', flex: 1 }}
                            />
                            <TextField
                                label="Eye Color"
                                value={formData.eye_color || ''}
                                onChange={handleInputChange('eye_color')}
                                sx={{ minWidth: '200px', flex: 1 }}
                            />
                        </Box>
                    </Paper>

                    {character?.homeworldDetails && (
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Homeworld
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong>Name:</strong> {character.homeworldDetails.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Climate:</strong> {character.homeworldDetails.climate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Terrain:</strong> {character.homeworldDetails.terrain}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Population:</strong> {character.homeworldDetails.population}
                            </Typography>
                        </Paper>
                    )}

                    {character?.filmsDetails && character.filmsDetails.length > 0 && (
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Films
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {character.filmsDetails.map((film, index) => (
                                    <Chip
                                        key={index}
                                        label={`Episode ${film.episode_id}: ${film.title}`}
                                        variant="outlined"
                                        color="primary"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    {character?.speciesDetails && character.speciesDetails.length > 0 && (
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Species
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {character.speciesDetails.map((species, index) => (
                                    <Chip
                                        key={index}
                                        label={species.name}
                                        variant="outlined"
                                        color="secondary"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    {character?.vehiclesDetails && character.vehiclesDetails.length > 0 && (
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Vehicles
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {character.vehiclesDetails.map((vehicle, index) => (
                                    <Chip
                                        key={index}
                                        label={vehicle.name}
                                        variant="outlined"
                                        color="info"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    {character?.starshipsDetails && character.starshipsDetails.length > 0 && (
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Starships
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {character.starshipsDetails.map((starship, index) => (
                                    <Chip
                                        key={index}
                                        label={starship.name}
                                        variant="outlined"
                                        color="warning"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ gap: 2, justifyContent: 'center' }}>
                <Button
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    color="inherit"
                    size="large"
                    sx={{
                        minWidth: 140,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        '& .MuiButton-startIcon': {
                            fontSize: isMobile ? '1rem' : '1.25rem',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    variant="contained"
                    disabled={!isDirty}
                    size="large"
                    sx={{
                        minWidth: 140,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        '& .MuiButton-startIcon': {
                            fontSize: isMobile ? '1rem' : '1.25rem',
                        }
                    }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
