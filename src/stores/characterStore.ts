import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Character } from '@/types/swapi';

interface CharacterStore {
    editedCharacters: Map<string, Character>;
    deletedCharacterIds: Set<string>;

    updateCharacter: (id: string, updates: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    isCharacterEdited: (id: string) => boolean;
    isCharacterDeleted: (id: string) => boolean;
    getEditedCharacter: (id: string) => Character | undefined;
    clearChanges: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
    persist(
        (set, get) => ({
            editedCharacters: new Map(),
            deletedCharacterIds: new Set(),

            updateCharacter: (id: string, updates: Partial<Character>) => {
                set((state) => {
                    const newMap = new Map(state.editedCharacters);
                    const existing = newMap.get(id);
                    if (existing) {
                        newMap.set(id, { ...existing, ...updates });
                    } else {
                        newMap.set(id, { ...updates } as Character);
                    }
                    return { editedCharacters: newMap };
                });
            },

            deleteCharacter: (id: string) => {
                set((state) => {
                    const newDeletedIds = new Set(state.deletedCharacterIds);
                    newDeletedIds.add(id);

                    const newMap = new Map(state.editedCharacters);
                    newMap.delete(id);

                    return {
                        deletedCharacterIds: newDeletedIds,
                        editedCharacters: newMap,
                    };
                });
            },

            isCharacterEdited: (id: string) => {
                return get().editedCharacters.has(id);
            },

            isCharacterDeleted: (id: string) => {
                return get().deletedCharacterIds.has(id);
            },

            getEditedCharacter: (id: string) => {
                return get().editedCharacters.get(id);
            },

            clearChanges: () => {
                set({
                    editedCharacters: new Map(),
                    deletedCharacterIds: new Set(),
                });
            },
        }),
        {
            name: 'character-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                editedCharacters: Array.from(state.editedCharacters.entries()) as [string, Character][],
                deletedCharacterIds: Array.from(state.deletedCharacterIds) as string[],
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.editedCharacters = new Map((state.editedCharacters as unknown as [string, Character][]) || []);
                    state.deletedCharacterIds = new Set((state.deletedCharacterIds as unknown as string[]) || []);
                }
            },
        }
    )
);