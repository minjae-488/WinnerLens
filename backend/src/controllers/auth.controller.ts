import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponseUtil } from '../utils/response';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// 간단한 인메모리 저장소 (개발/데모용)
const verificationCodes = new Map<string, { code: string; expires: number }>();

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
     * POST /api/v1/auth/verify-send
     * 인증 코드 발송
     */
    static sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) throw new AppError('Email is required', 400);

        // 6자리 코드 생성
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 5분 유효
        verificationCodes.set(email, {
            code,
            expires: Date.now() + 5 * 60 * 1000
        });

        // 실제 메일 발송 대신 콘솔 출력
        console.log(`📧 [Email Verification] Code for ${email}: ${code}`);

        return ApiResponseUtil.success(res, {
            message: 'Verification code sent (Check server console)',
            code // 개발 편의를 위해 응답에도 포함
        });
    });

    /**
     * POST /api/v1/auth/verify-code
     * 인증 코드 검증
     */
    static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;

        const record = verificationCodes.get(email);
        if (!record) throw new AppError('Verification code not found or expired', 400);

        if (record.expires < Date.now()) {
            verificationCodes.delete(email);
            throw new AppError('Verification code expired', 400);
        }

        if (record.code !== code) {
            throw new AppError('Invalid verification code', 400);
        }

        // 인증 성공 후 코드 삭제
        verificationCodes.delete(email);

        return ApiResponseUtil.success(res, { verified: true });
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

    /**
     * PATCH /api/v1/auth/me
     * 프로필 업데이트
     */
    static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const user = await AuthService.updateProfile(req.user.userId, req.body);
        return ApiResponseUtil.success(res, user);
    });
}
