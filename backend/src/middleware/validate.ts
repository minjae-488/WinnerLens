import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponseUtil } from '../utils/response';

/**
 * Zod 스키마를 사용한 요청 검증 미들웨어
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, 'Validation failed', {
                errors: error.errors,
            });
        }
    };
};
