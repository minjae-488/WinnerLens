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

// 사용자 타입
export interface User {
    id: string;
    email: string;
    name?: string;
    subscriptionTier: string;
    subscriptionStatus: string;
    createdAt: string;
    updatedAt?: string;
}

// 인증 응답
export interface AuthResponse {
    user: User;
    token: string;
}

// 상품 타입
export interface Product {
    id: string;
    productName: string;
    category: string;
    description?: string;
    price: number;
    cost?: number;
    margin?: number;
    options?: Record<string, any>;
    demandScore?: number;
    competitionScore?: number;
    marginScore?: number;
    operabilityScore?: number;
    totalScore?: number;
    status: 'draft' | 'pending' | 'registered' | 'rejected';
    coupangProductId?: string;
    createdAt: string;
    updatedAt: string;
}

// 페이지네이션
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

// 카테고리 통계
export interface CategoryStats {
    category: string;
    total: number;
    draft: number;
    pending: number;
    registered: number;
    rejected: number;
    avgScore: number;
}

// 폼 입력 타입
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}

export interface CreateProductInput {
    productName: string;
    category: string;
    description?: string;
    price: number;
    cost?: number;
    margin?: number;
    options?: Record<string, any>;
}

export interface UpdateProductInput {
    productName?: string;
    category?: string;
    description?: string;
    price?: number;
    cost?: number;
    margin?: number;
    options?: Record<string, any>;
    status?: 'draft' | 'pending' | 'registered' | 'rejected';
}

export interface UpdateScoreInput {
    demandScore?: number;
    competitionScore?: number;
    marginScore?: number;
    operabilityScore?: number;
}
