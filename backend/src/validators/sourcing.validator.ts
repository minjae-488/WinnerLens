import { z } from 'zod';

/**
 * 도매 소싱 관련 Validation 스키마
 */

// 검색 옵션 스키마
export const searchOptionsSchema = z.object({
    priceRange: z.tuple([z.number(), z.number()]).optional(),
    minMargin: z.number().min(0).max(1).optional(),
    category: z.string().optional(),
    sortBy: z.enum(['price', 'popularity', 'newest']).optional(),
    limit: z.number().int().positive().max(100).optional(),
});

// 도매 상품 검색 스키마
export const sourcingSearchSchema = z.object({
    keyword: z.string().min(1, '키워드를 입력해주세요').max(100),
    site: z.enum(['1866', 'domeggook'], {
        errorMap: () => ({ message: '지원하지 않는 사이트입니다' }),
    }),
    options: searchOptionsSchema.optional(),
});

// 가격 계산 스키마
export const calculatePriceSchema = z.object({
    wholesalePrice: z.number().positive('도매가는 0보다 커야 합니다'),
    quantity: z.number().int().positive('수량은 1개 이상이어야 합니다'),
    shippingCost: z.number().min(0, '배송비는 0 이상이어야 합니다'),
    extraCost: z.number().min(0).optional(),
    targetMargin: z.number().min(0).max(0.9, '목표 마진은 90% 이하여야 합니다'),
    category: z.string().min(1, '카테고리를 선택해주세요'),
    keyword: z.string().optional(),
});

// AI 리스팅 생성 스키마
export const generateListingSchema = z.object({
    wholesaleProduct: z.object({
        id: z.string(),
        site: z.enum(['1866', 'domeggook']),
        name: z.string(),
        price: z.number(),
        category: z.string(),
        images: z.array(z.string()),
        description: z.string().optional(),
        specifications: z.record(z.any()).optional(),
    }),
});

// 쿠팡 등록 스키마
export const registerProductSchema = z.object({
    listing: z.object({
        productName: z.string().min(1).max(200),
        description: z.string().min(1),
        features: z.array(z.string()),
        specifications: z.record(z.string()),
        images: z.array(z.string()).min(1, '최소 1개 이상의 이미지가 필요합니다'),
    }),
    pricing: z.object({
        wholesalePrice: z.number().positive(),
        quantity: z.number().int().positive(),
        shippingCost: z.number().min(0),
        extraCost: z.number().min(0).optional(),
        sellingPrice: z.number().positive(),
        pricingStrategy: z.enum(['aggressive', 'balanced', 'premium', 'custom']),
    }),
});

// 타입 추출
export type SourcingSearchInput = z.infer<typeof sourcingSearchSchema>;
export type CalculatePriceInput = z.infer<typeof calculatePriceSchema>;
export type GenerateListingInput = z.infer<typeof generateListingSchema>;
export type RegisterProductInput = z.infer<typeof registerProductSchema>;
