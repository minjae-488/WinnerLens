import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuthUtil } from '../utils/auth';
import { ApiResponseUtil } from '../utils/response';

/**
 * JWT 인증 미들웨어
 * Authorization 헤더의 토큰을 검증하고 사용자 정보를 req.user에 추가
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = AuthUtil.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            return ApiResponseUtil.unauthorized(res, 'No token provided');
        }

        const payload = AuthUtil.verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return ApiResponseUtil.unauthorized(res, 'Invalid or expired token');
    }
};

/**
 * 구독 티어 확인 미들웨어
 * 특정 구독 티어 이상의 사용자만 접근 가능
 */
export const requireSubscription = (...allowedTiers: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res, 'Authentication required');
        }

        if (!allowedTiers.includes(req.user.subscriptionTier)) {
            return ApiResponseUtil.forbidden(
                res,
                `This feature requires ${allowedTiers.join(' or ')} subscription`
            );
        }

        next();
    };
};
