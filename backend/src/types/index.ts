import { Request } from 'express';

// JWT Payload 타입
export interface JwtPayload {
    userId: string;
    email: string;
    subscriptionTier: string;
}

// 인증된 요청 타입
export interface AuthRequest extends Request {
    user?: JwtPayload;
}

// API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
}

// 페이지네이션 타입
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
