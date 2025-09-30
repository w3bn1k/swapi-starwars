import { useCharacterStore } from '@/stores';

describe('Stores', () => {
    it('should be importable', () => {
        expect(() => {
            require('@/stores/characterStore');
        }).not.toThrow();
    });

    it('should export hooks', () => {
        expect(typeof useCharacterStore).toBe('function');
    });
});