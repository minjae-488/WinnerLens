import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiResponseUtil {
    static success<T>(res: Response, data: T, statusCode: number = 200): Response {
        const response: ApiResponse<T> = {
            success: true,
            data,
        };
        return res.status(statusCode).json(response);
    }

    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        code?: string,
        details?: any
    ): Response {
        const response: ApiResponse = {
            success: false,
            error: {
                message,
                code,
                details,
            },
        };
        return res.status(statusCode).json(response);
    }

    static badRequest(res: Response, message: string, details?: any): Response {
        return this.error(res, message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
        return this.error(res, message, 401, 'UNAUTHORIZED');
    }

    static forbidden(res: Response, message: string = 'Forbidden'): Response {
        return this.error(res, message, 403, 'FORBIDDEN');
    }

    static notFound(res: Response, message: string = 'Resource not found'): Response {
        return this.error(res, message, 404, 'NOT_FOUND');
    }

    static conflict(res: Response, message: string, details?: any): Response {
        return this.error(res, message, 409, 'CONFLICT', details);
    }

    static internalError(res: Response, message: string = 'Internal server error'): Response {
        return this.error(res, message, 500, 'INTERNAL_ERROR');
    }
}
