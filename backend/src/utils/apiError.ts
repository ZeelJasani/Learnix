export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: Record<string, string[]>;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        errors?: Record<string, string[]>
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, errors?: Record<string, string[]>): ApiError {
        return new ApiError(400, message, true, errors);
    }

    static unauthorized(message = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message = 'Resource not found'): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    static tooManyRequests(message = 'Too many requests'): ApiError {
        return new ApiError(429, message);
    }

    static internal(message = 'Internal server error'): ApiError {
        return new ApiError(500, message, false);
    }
}
