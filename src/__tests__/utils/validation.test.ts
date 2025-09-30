import { validateCharacter, validateField } from '@/utils/validation';

describe('Validation', () => {
    describe('validateField', () => {
        it('validates name field', () => {
            expect(validateField('name', 'Luke Skywalker')).toBeUndefined();
            expect(validateField('name', '')).toBe('Name is required');
            expect(validateField('name', 'A'.repeat(101))).toBe('Name must be less than 100 characters');
        });

        it('validates height field', () => {
            expect(validateField('height', '172')).toBeUndefined();
            expect(validateField('height', '')).toBeUndefined();
            expect(validateField('height', 'abc')).toBe('Height must be a positive number');
            expect(validateField('height', '-10')).toBe('Height must be a positive number');
        });

        it('validates mass field', () => {
            expect(validateField('mass', '77')).toBeUndefined();
            expect(validateField('mass', '')).toBeUndefined();
            expect(validateField('mass', 'abc')).toBe('Mass must be a positive number');
            expect(validateField('mass', '-10')).toBe('Mass must be a positive number');
        });

        it('validates birth year field', () => {
            expect(validateField('birth_year', '19BBY')).toBeUndefined();
            expect(validateField('birth_year', '')).toBeUndefined();
            expect(validateField('birth_year', 'invalid')).toBe('Birth year must be in format like "19BBY" or "5ABY"');
        });

        it('validates gender field', () => {
            expect(validateField('gender', 'male')).toBeUndefined();
            expect(validateField('gender', 'female')).toBeUndefined();
            expect(validateField('gender', 'n/a')).toBeUndefined();
            expect(validateField('gender', 'hermaphrodite')).toBeUndefined();
            expect(validateField('gender', 'invalid')).toBe('Gender must be one of: male, female, n/a, hermaphrodite');
        });
    });

    describe('validateCharacter', () => {
        it('validates complete character', () => {
            const character = {
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

            const result = validateCharacter(character);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('validates character with errors', () => {
            const character = {
                name: '',
                height: 'invalid',
                mass: '-10',
                hair_color: 'blond',
                skin_color: 'fair',
                eye_color: 'blue',
                birth_year: 'invalid',
                gender: 'invalid',
                homeworld: 'https://swapi.py4e.com/api/planets/1/',
                films: [],
                species: [],
                vehicles: [],
                starships: [],
                created: '2014-12-09T13:50:51.644000Z',
                edited: '2014-12-20T21:17:56.891000Z',
                url: 'https://swapi.py4e.com/api/people/1/',
            };

            const result = validateCharacter(character);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.field === 'name')).toBe(true);
            expect(result.errors.some(error => error.field === 'height')).toBe(true);
            expect(result.errors.some(error => error.field === 'mass')).toBe(true);
            expect(result.errors.some(error => error.field === 'birth_year')).toBe(true);
            expect(result.errors.some(error => error.field === 'gender')).toBe(true);
        });
    });
});