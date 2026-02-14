/**
 * API Client for connecting to Learnix Backend
 * Learnix Backend સાથે કનેક્ટ કરવા માટેનો API Client
 *
 * Aa module backend API sathe communicate karva mate ek centralized client provide kare chhe.
 * This module provides a centralized client to communicate with the backend API.
 *
 * Features / વિશેષતાઓ:
 * - GET, POST, PUT, DELETE HTTP methods
 * - Automatic Clerk auth token injection (server-side)
 * - Consistent error handling across all methods
 * - Type-safe API responses
 */

// API base URL environment variable mathi ley chhe, default localhost:5000 rakhe chhe
// Reads API base URL from environment variable, defaults to localhost:5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard API response format / Standard API response format
 * Backend badhaj responses aa format ma mokle chhe
 * Backend sends all responses in this format
 */
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

/**
 * ApiClient class - Backend sathe HTTP calls karva mate
 * ApiClient class - For making HTTP calls to the backend
 *
 * Aa class fetch API no use kare chhe ane consistent error handling provide kare chhe.
 * This class uses the fetch API and provides consistent error handling.
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * GET request mokle chhe specified endpoint par
     * Sends a GET request to the specified endpoint
     *
     * @param endpoint - API endpoint path (e.g., '/users/me')
     * @param token - Optional Clerk auth token for authenticated requests
     * @returns ApiResponse with typed data
     */
    async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers,
                cache: 'no-store',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`[ApiClient] GET ${endpoint} not found (404)`);
                } else {
                    console.error(`[ApiClient] GET ${endpoint} failed: ${response.status} ${response.statusText}`);
                }
            }

            return response.json();
        } catch (error) {
            // Network error handle kare chhe (e.g., backend down hoy tyare)
            // Handles network errors (e.g., when backend is down)
            console.error(`[ApiClient] GET ${endpoint} network error:`, error);
            return {
                success: false,
                message: 'Network error occurred. Please ensure backend is running.',
            } as ApiResponse<T>;
        }
    }

    /**
     * POST request mokle chhe data sathe
     * Sends a POST request with data payload
     *
     * @param endpoint - API endpoint path
     * @param data - Request body data
     * @param token - Optional Clerk auth token
     * @returns ApiResponse with typed data
     */
    async post<T>(endpoint: string, data: unknown, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn(`[ApiClient] POST ${endpoint} unauthorized (401) - Token might be expired`);
                } else {
                    console.error(`[ApiClient] POST ${endpoint} failed: ${response.status} ${response.statusText}`);
                }
            }

            return response.json();
        } catch (error) {
            // Network error handle kare chhe
            // Handles network errors
            console.error(`[ApiClient] POST ${endpoint} network error:`, error);
            return {
                success: false,
                message: 'Network error occurred. Please ensure backend is running.',
            } as ApiResponse<T>;
        }
    }

    /**
     * PUT request mokle chhe data update karva mate
     * Sends a PUT request to update data
     *
     * @param endpoint - API endpoint path
     * @param data - Updated data payload
     * @param token - Optional Clerk auth token
     * @returns ApiResponse with typed data
     */
    async put<T>(endpoint: string, data: unknown, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error(`[ApiClient] PUT ${endpoint} failed: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // Network error handle kare chhe - PUT request mate
            // Handles network errors for PUT requests
            console.error(`[ApiClient] PUT ${endpoint} network error:`, error);
            return {
                success: false,
                message: 'Network error occurred. Please ensure backend is running.',
            } as ApiResponse<T>;
        }
    }

    /**
     * DELETE request mokle chhe resource delete karva mate
     * Sends a DELETE request to remove a resource
     *
     * @param endpoint - API endpoint path
     * @param token - Optional Clerk auth token
     * @returns ApiResponse with typed data
     */
    async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                console.error(`[ApiClient] DELETE ${endpoint} failed: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // Network error handle kare chhe - DELETE request mate
            // Handles network errors for DELETE requests
            console.error(`[ApiClient] DELETE ${endpoint} network error:`, error);
            return {
                success: false,
                message: 'Network error occurred. Please ensure backend is running.',
            } as ApiResponse<T>;
        }
    }
}

// Singleton ApiClient instance export kare chhe
// Exports a singleton ApiClient instance
export const api = new ApiClient(API_BASE_URL);


