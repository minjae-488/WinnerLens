import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponseUtil } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export class AuthController {
    /**
     * POST /api/v1/auth/register
     * 회원가입
     */
    static register = asyncHandler(async (req: Request, res: Response) => {
        const result = await AuthService.register(req.body);
        return ApiResponseUtil.success(res, result, 201);
    });

    /**
     * POST /api/v1/auth/login
     * 로그인
     */
    static login = asyncHandler(async (req: Request, res: Response) => {
        const result = await AuthService.login(req.body);
        return ApiResponseUtil.success(res, result);
    });

    /**
     * GET /api/v1/auth/me
     * 현재 사용자 정보 조회
     */
    static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const user = await AuthService.getCurrentUser(req.user.userId);
        return ApiResponseUtil.success(res, user);
    });
}
