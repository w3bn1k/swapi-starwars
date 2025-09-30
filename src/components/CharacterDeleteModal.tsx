'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';
import type { CharacterWithDetails } from '@/types/swapi';

type TCharacterDeleteModal = {
    character: CharacterWithDetails | null;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function CharacterDeleteModal({ character, open, onClose, onConfirm }: TCharacterDeleteModal) {
    const { addSuccessNotification, addErrorNotification } = useNotifications();

    const handleDelete = (): void => {
        try {
            onConfirm();
            addSuccessNotification('Character deleted successfully');
        } catch {
            addErrorNotification('Failed to delete character');
        }
    };

    const handleCancel = (): void => {
        onClose();
    };

    if (!character) return <></>;

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <DeleteIcon color="error" />
                    <Typography variant="h6">Delete Character</Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    This action cannot be undone. The character will be permanently deleted from your local storage.
                </Alert>

                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete <strong>{character.name}</strong>?
                </Typography>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Height:</strong> {character.height} cm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Mass:</strong> {character.mass} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Gender:</strong> {character.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Birth Year:</strong> {character.birth_year}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="error"
                >
                    Delete Character
                </Button>
            </DialogActions>
        </Dialog>
    );
}
