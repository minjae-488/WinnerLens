import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponseUtil } from '../utils/response';

/**
 * Zod 스키마를 사용한 쿼리 파라미터 검증 미들웨어
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse(req.query);
            req.query = validated as any;
            next();
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, 'Invalid query parameters', {
                errors: error.errors,
            });
        }
    };
};
