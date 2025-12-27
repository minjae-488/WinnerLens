import { Request, Response, NextFunction } from 'express';
import { ApiResponseUtil } from '../utils/response';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    if (err instanceof AppError) {
        return ApiResponseUtil.error(
            res,
            err.message,
            err.statusCode,
            err.code,
            err.details
        );
    }

    // Prisma 에러 처리
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err as any;
        if (prismaError.code === 'P2002') {
            return ApiResponseUtil.conflict(res, 'Resource already exists', {
                field: prismaError.meta?.target,
            });
        }
        if (prismaError.code === 'P2025') {
            return ApiResponseUtil.notFound(res, 'Resource not found');
        }
    }

    // Validation 에러 처리 (Zod)
    if (err.name === 'ZodError') {
        const zodError = err as any;
        return ApiResponseUtil.badRequest(res, 'Validation failed', {
            errors: zodError.errors,
        });
    }

    // 기본 에러 응답
    return ApiResponseUtil.internalError(res, 'An unexpected error occurred');
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
