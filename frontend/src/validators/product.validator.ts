import { z } from 'zod';

// 상품 생성 스키마
export const createProductSchema = z.object({
    productName: z.string().min(2, 'Product name must be at least 2 characters'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    cost: z.number().positive('Cost must be positive').optional(),
    margin: z.number().min(0).max(100, 'Margin must be between 0 and 100').optional(),
    options: z.record(z.any()).optional(), // JSON 객체
});

// 상품 수정 스키마 (모든 필드 선택적)
export const updateProductSchema = z.object({
    productName: z.string().min(2, 'Product name must be at least 2 characters').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive').optional(),
    cost: z.number().positive('Cost must be positive').optional(),
    margin: z.number().min(0).max(100, 'Margin must be between 0 and 100').optional(),
    options: z.record(z.any()).optional(),
    status: z.enum(['draft', 'pending', 'registered', 'rejected']).optional(),
});

// 스코어 업데이트 스키마
export const updateScoreSchema = z.object({
    demandScore: z.number().min(0).max(100).optional(),
    competitionScore: z.number().min(0).max(100).optional(),
    marginScore: z.number().min(0).max(100).optional(),
    operabilityScore: z.number().min(0).max(100).optional(),
});

// 쿼리 파라미터 스키마
export const productQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    category: z.string().optional(),
    status: z.enum(['draft', 'pending', 'registered', 'rejected']).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'price', 'totalScore']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    search: z.string().optional(), // 상품명 검색
});

// 타입 추출
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
