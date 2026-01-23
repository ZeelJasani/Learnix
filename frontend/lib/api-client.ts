/**
 * API Client for connecting to Learnix Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getAuthHeaders(): Promise<HeadersInit> {
        // Import Clerk auth dynamically to get the token
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Get token from Clerk if available (for server-side)
        if (typeof window === 'undefined') {
            try {
                const { auth } = await import('@clerk/nextjs/server');
                const { getToken } = await auth();
                const token = await getToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            } catch {
                // Not authenticated or Clerk not available
            }
        }

        return headers;
    }

    async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        return response.json();
    }

    async post<T>(endpoint: string, data: unknown, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        return response.json();
    }

    async put<T>(endpoint: string, data: unknown, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        return response.json();
    }

    async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers,
        });

        return response.json();
    }
}

export const api = new ApiClient(API_BASE_URL);

// Helper function to get auth token from Clerk
export async function getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
        try {
            const { auth } = await import('@clerk/nextjs/server');
            const { getToken } = await auth();
            return await getToken();
        } catch {
            return null;
        }
    }
    return null;
}
