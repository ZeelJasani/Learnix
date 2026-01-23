import { Response } from 'express';

interface ApiResponseData<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export class ApiResponse {
    static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): Response {
        const response: ApiResponseData<T> = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }

    static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
        return ApiResponse.success(res, data, message, 201);
    }

    static noContent(res: Response): Response {
        return res.status(204).send();
    }

    static paginated<T>(
        res: Response,
        data: T[],
        meta: { page: number; limit: number; total: number },
        message = 'Success'
    ): Response {
        const totalPages = Math.ceil(meta.total / meta.limit);
        const response: ApiResponseData<T[]> = {
            success: true,
            message,
            data,
            meta: {
                ...meta,
                totalPages,
            },
        };
        return res.status(200).json(response);
    }

    static error(
        res: Response,
        message: string,
        statusCode = 500,
        errors?: Record<string, string[]>
    ): Response {
        const response: ApiResponseData<null> = {
            success: false,
            message,
            errors,
        };
        return res.status(statusCode).json(response);
    }
}
