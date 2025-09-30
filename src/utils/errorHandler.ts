export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number | undefined;
    public readonly isOperational: boolean;

    constructor(message: string, code: string, statusCode?: number, isOperational = true) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NetworkError extends AppError {
    constructor(message = 'Network connection failed') {
        super(message, 'NETWORK_ERROR', 0);
    }
}

export class ApiError extends AppError {
    constructor(message: string, statusCode: number) {
        super(message, 'API_ERROR', statusCode);
        this.name = 'ApiError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
        return new NetworkError();
    }

    if (error instanceof Error) {
        return new AppError(error.message, 'UNKNOWN_ERROR', undefined, false);
    }

    return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', undefined, false);
}

export function isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

export function isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
}
