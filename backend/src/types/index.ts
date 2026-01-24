import { Request } from 'express';

// Re-export types from middleware
export { AuthenticatedRequest } from '../middleware/auth';
export { UserRequest } from '../middleware/requireUser';

// MongoDB document ID type
export type MongoId = string;

// Pagination options
export interface PaginationOptions {
    page?: number;
    limit?: number;
}

// Paginated response
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// API Response types
export interface ApiSuccessResponse<T> {
    success: true;
    message?: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export type ApiResponseType<T> = ApiSuccessResponse<T> | ApiErrorResponse;
