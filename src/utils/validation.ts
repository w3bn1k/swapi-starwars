import type { Character } from '@/types/swapi';

export interface ValidationError {
    field: keyof Character;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export function validateCharacter(character: Partial<Character>): ValidationResult {
    const errors: ValidationError[] = [];

    if (!character.name || character.name.trim() === '') {
        errors.push({ field: 'name', message: 'Name is required' });
    } else if (character.name.length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (character.name.length > 100) {
        errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
    }

    if (character.height !== undefined && character.height !== '') {
        const height = parseInt(character.height);
        if (isNaN(height)) {
            errors.push({ field: 'height', message: 'Height must be a positive number' });
        } else if (height <= 0) {
            errors.push({ field: 'height', message: 'Height must be a positive number' });
        } else if (height > 1000) {
            errors.push({ field: 'height', message: 'Height must be less than 1000 cm' });
        }
    }

    if (character.mass !== undefined && character.mass !== '') {
        const mass = parseFloat(character.mass);
        if (isNaN(mass)) {
            errors.push({ field: 'mass', message: 'Mass must be a positive number' });
        } else if (mass <= 0) {
            errors.push({ field: 'mass', message: 'Mass must be a positive number' });
        } else if (mass > 10000) {
            errors.push({ field: 'mass', message: 'Mass must be less than 10000 kg' });
        }
    }

    if (character.hair_color && character.hair_color.length > 50) {
        errors.push({ field: 'hair_color', message: 'Hair color must be less than 50 characters' });
    }

    if (character.skin_color && character.skin_color.length > 50) {
        errors.push({ field: 'skin_color', message: 'Skin color must be less than 50 characters' });
    }

    if (character.eye_color && character.eye_color.length > 50) {
        errors.push({ field: 'eye_color', message: 'Eye color must be less than 50 characters' });
    }

    if (character.birth_year && character.birth_year !== '') {
        const birthYearPattern = /^(\d+)(BBY|ABY)$/i;
        if (!birthYearPattern.test(character.birth_year)) {
            errors.push({ field: 'birth_year', message: 'Birth year must be in format like "19BBY" or "5ABY"' });
        }
    }

    if (character.gender) {
        const validGenders = ['male', 'female', 'n/a', 'hermaphrodite'];
        if (!validGenders.includes(character.gender.toLowerCase())) {
            errors.push({ field: 'gender', message: 'Gender must be one of: male, female, n/a, hermaphrodite' });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function getFieldError(errors: ValidationError[], field: keyof Character): string | undefined {
    return errors.find(error => error.field === field)?.message;
}

export function validateField(field: keyof Character, value: string): string | undefined {
    const character: Partial<Character> = { [field]: value };
    const result = validateCharacter(character);
    return getFieldError(result.errors, field);
}
