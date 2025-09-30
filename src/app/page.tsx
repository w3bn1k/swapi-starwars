'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { CharacterSearch } from '@/components/CharacterSearch';
import { CharacterTableWithPagination } from '@/components/CharacterTableWithPagination';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { PageTransition } from '@/components/PageTransition';
import { NotificationSnackbar } from '@/components/ui/NotificationSnackbar';
import { CharacterEditModal } from '@/components/CharacterEditModal';
import { CharacterDeleteModal } from '@/components/CharacterDeleteModal';
import { useCharactersWithPagination } from '@/hooks/useCharactersWithPagination';
import { usePreloadData } from '@/hooks/usePreloadData';
import { useCharacterStore } from '@/stores/characterStore';
import { useRouter } from 'next/navigation';
import { extractCharacterId } from '@/utils/api';
import type { CharacterWithDetails } from '@/types/swapi';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    characters,
    loading,
    error,
    currentPage,
    totalPages,
    searchCharacters,
    searchQuery,
    setPage,
    updateCharacter,
    deleteCharacter,
    isCharacterEdited
  } = useCharactersWithPagination();

  const { preloadCharacters } = usePreloadData();
  const { clearChanges } = useCharacterStore();

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterWithDetails | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCharacterSelect = useCallback((character: CharacterWithDetails): void => {
    const characterId = extractCharacterId(character.url);
    router.push(`/character/${characterId}`);
  }, [router]);

  const handleEdit = useCallback((character: CharacterWithDetails): void => {
    setSelectedCharacter(character);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((character: CharacterWithDetails): void => {
    setSelectedCharacter(character);
    setIsDeleteModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback((updatedCharacter: CharacterWithDetails): void => {
    const characterId = extractCharacterId(updatedCharacter.url);
    if (characterId) {
      updateCharacter(characterId, updatedCharacter);
      setIsEditModalOpen(false);
      setSelectedCharacter(null);
    }
  }, [updateCharacter]);

  const handleConfirmDelete = useCallback((): void => {
    if (selectedCharacter) {
      const characterId = extractCharacterId(selectedCharacter.url);
      if (characterId) {
        deleteCharacter(characterId);
        setIsDeleteModalOpen(false);
        setSelectedCharacter(null);
      }
    }
  }, [selectedCharacter, deleteCharacter]);

  const handleCloseModals = useCallback((): void => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCharacter(null);
  }, []);

  const handleResetData = useCallback((): void => {
    clearChanges();
  }, [clearChanges]);

  useEffect(() => {
    preloadCharacters();
  }, [preloadCharacters]);

  if (error) {
    return (
      <>
        <ResponsiveContainer sx={{ pt: isMobile ? 8 : 4 }}>
          <Box textAlign="center" mt={8}>
            <Typography variant="h5" color="error" gutterBottom>
              Error loading characters
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </ResponsiveContainer>
      </>
    );
  }

  return (
    <>

      <ResponsiveContainer sx={{ pt: isMobile ? 8 : 4 }}>
        <Box textAlign="center" mb={isMobile ? 4 : 6} className="fade-in-up">
          <Typography
            variant={isMobile ? 'h3' : 'h1'}
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
            }}
          >
            STAR WARS CHARACTERS
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            color="text.secondary"
            paragraph
            sx={{
              textShadow: '0 0 10px rgba(0, 191, 255, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            Explore the galaxy far, far away...
          </Typography>
        </Box>

        <CharacterSearch
          onSearch={searchCharacters}
          searchQuery={searchQuery}
          loading={loading}
          onResetData={handleResetData}
        />

        <PageTransition isLoading={loading}>
          <CharacterTableWithPagination
            characters={characters}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            onCharacterSelect={handleCharacterSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isCharacterEdited={isCharacterEdited}
          />
        </PageTransition>

        <CharacterEditModal
          character={selectedCharacter}
          open={isEditModalOpen}
          onClose={handleCloseModals}
          onSave={handleSaveEdit}
        />
        <CharacterDeleteModal
          character={selectedCharacter}
          open={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
        />
        <NotificationSnackbar />
      </ResponsiveContainer>
    </>
  );
}
