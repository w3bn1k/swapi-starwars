import { renderHook, act } from '@testing-library/react';
import { useCharacterStore } from '@/stores/characterStore';
import type { Character } from '@/types/swapi';

const mockCharacter: Character = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.py4e.com/api/planets/1/',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.py4e.com/api/people/1/',
};

describe('characterStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useCharacterStore.getState().clearChanges();
    });

    it('should initialize with empty state', () => {
        const { result } = renderHook(() => useCharacterStore());

        expect(result.current.editedCharacters.size).toBe(0);
        expect(result.current.deletedCharacterIds.size).toBe(0);
    });

    it('should update character', () => {
        const { result } = renderHook(() => useCharacterStore());

        act(() => {
            result.current.updateCharacter('1', mockCharacter);
        });

        expect(result.current.editedCharacters.get('1')).toEqual(mockCharacter);
        expect(result.current.isCharacterEdited('1')).toBe(true);
    });

    it('should delete character', () => {
        const { result } = renderHook(() => useCharacterStore());

        act(() => {
            result.current.deleteCharacter('1');
        });

        expect(result.current.deletedCharacterIds.has('1')).toBe(true);
        expect(result.current.isCharacterDeleted('1')).toBe(true);
    });

    it('should get edited character', () => {
        const { result } = renderHook(() => useCharacterStore());

        act(() => {
            result.current.updateCharacter('1', mockCharacter);
        });

        const editedCharacter = result.current.getEditedCharacter('1');
        expect(editedCharacter).toEqual(mockCharacter);
    });

    it('should clear all data', () => {
        const { result } = renderHook(() => useCharacterStore());

        act(() => {
            result.current.updateCharacter('1', mockCharacter);
            result.current.deleteCharacter('2');
        });

        expect(result.current.editedCharacters.size).toBe(1);
        expect(result.current.deletedCharacterIds.size).toBe(1);

        act(() => {
            result.current.clearChanges();
        });

        expect(result.current.editedCharacters.size).toBe(0);
        expect(result.current.deletedCharacterIds.size).toBe(0);
    });

    it('should persist data to localStorage', () => {
        const { result } = renderHook(() => useCharacterStore());

        act(() => {
            result.current.updateCharacter('1', mockCharacter);
            result.current.deleteCharacter('2');
        });

        const storedData = localStorage.getItem('character-store');
        expect(storedData).toBeTruthy();

        const parsedData = JSON.parse(storedData!);
        expect(parsedData.state.editedCharacters).toHaveLength(1);
        expect(parsedData.state.deletedCharacterIds).toHaveLength(1);
    });

    it('should restore data from localStorage', () => {
        const { result: firstResult } = renderHook(() => useCharacterStore());
        act(() => {
            firstResult.current.updateCharacter('1', mockCharacter);
            firstResult.current.deleteCharacter('2');
        });

        const { result: secondResult } = renderHook(() => useCharacterStore());

        expect(secondResult.current.editedCharacters.get('1')).toEqual(mockCharacter);
        expect(secondResult.current.deletedCharacterIds.has('2')).toBe(true);
    });
});
