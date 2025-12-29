import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    CreateProductInput,
    UpdateProductInput,
    UpdateScoreInput,
    ProductQueryInput,
} from '../validators/product.validator';
import { PaginatedResponse } from '../types';

export class ProductService {
    /**
     * 상품 생성
     */
    static async createProduct(userId: string, data: CreateProductInput) {
        const { productName, category, description, price, cost, margin, options } = data;

        // 마진 자동 계산 (cost가 있는 경우)
        let calculatedMargin = margin;
        if (cost && price && !margin) {
            calculatedMargin = Number((((price - cost) / price) * 100).toFixed(2));
        }

        const product = await prisma.product.create({
            data: {
                userId,
                productName,
                category,
                description,
                price,
                cost,
                margin: calculatedMargin,
                options: options || {},
                status: 'draft',
            },
        });

        return product;
    }

    /**
     * 상품 목록 조회 (페이지네이션, 필터링, 정렬)
     */
    static async getProducts(
        userId: string,
        query: ProductQueryInput
    ): Promise<PaginatedResponse<any>> {
        const { page = 1, limit = 10, category, status, sortBy = 'createdAt', sortOrder = 'desc', search } = query;

        // 필터 조건 구성
        const where: any = { userId };

        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        if (search) {
            where.productName = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // 총 개수 조회
        const total = await prisma.product.count({ where });

        // 페이지네이션 계산
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(total / limit);

        // 상품 조회
        const products = await prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: {
                id: true,
                productName: true,
                category: true,
                description: true,
                price: true,
                cost: true,
                margin: true,
                options: true,
                demandScore: true,
                competitionScore: true,
                marginScore: true,
                operabilityScore: true,
                totalScore: true,
                status: true,
                coupangProductId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }

    /**
     * 상품 상세 조회
     */
    static async getProductById(userId: string, productId: string) {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                userId,
            },
            include: {
                registrations: {
                    orderBy: {
                        registeredAt: 'desc',
                    },
                    take: 5,
                },
            },
        });

        if (!product) {
            throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }

        return product;
    }

    /**
     * 상품 수정
     */
    static async updateProduct(userId: string, productId: string, data: UpdateProductInput) {
        // 상품 존재 및 권한 확인
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                userId,
            },
        });

        if (!existingProduct) {
            throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }

        // 마진 재계산 (price나 cost가 변경된 경우)
        let updateData: any = { ...data };

        if (data.price || data.cost) {
            const newPrice = data.price || existingProduct.price;
            const newCost = data.cost || existingProduct.cost;

            if (newCost && newPrice) {
                updateData.margin = Number((((Number(newPrice) - Number(newCost)) / Number(newPrice)) * 100).toFixed(2));
            }
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        return product;
    }

    /**
     * 상품 삭제
     */
    static async deleteProduct(userId: string, productId: string) {
        // 상품 존재 및 권한 확인
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                userId,
            },
        });

        if (!existingProduct) {
            throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return { message: 'Product deleted successfully' };
    }

    /**
     * 상품 스코어 업데이트
     */
    static async updateProductScore(userId: string, productId: string, scores: UpdateScoreInput) {
        // 상품 존재 및 권한 확인
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                userId,
            },
        });

        if (!existingProduct) {
            throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }

        // 총점 계산 (가중 평균)
        const weights = {
            demand: 0.30,      // 수요 30%
            competition: 0.25, // 경쟁 25%
            margin: 0.25,      // 마진 25%
            operability: 0.20, // 운영 가능성 20%
        };

        const demandScore = scores.demandScore ?? existingProduct.demandScore ?? 0;
        const competitionScore = scores.competitionScore ?? existingProduct.competitionScore ?? 0;
        const marginScore = scores.marginScore ?? existingProduct.marginScore ?? 0;
        const operabilityScore = scores.operabilityScore ?? existingProduct.operabilityScore ?? 0;

        const totalScore = Math.round(
            demandScore * weights.demand +
            competitionScore * weights.competition +
            marginScore * weights.margin +
            operabilityScore * weights.operability
        );

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                ...scores,
                totalScore,
            },
        });

        return product;
    }

    /**
     * 카테고리별 통계
     */
    static async getCategoryStats(userId: string) {
        const products = await prisma.product.findMany({
            where: { userId },
            select: {
                category: true,
                status: true,
                totalScore: true,
            },
        });

        // 카테고리별 집계
        const stats = products.reduce((acc: any, product) => {
            const category = product.category;

            if (!acc[category]) {
                acc[category] = {
                    category,
                    total: 0,
                    draft: 0,
                    pending: 0,
                    registered: 0,
                    rejected: 0,
                    avgScore: 0,
                    totalScore: 0,
                };
            }

            acc[category].total++;
            acc[category][product.status]++;

            if (product.totalScore) {
                acc[category].totalScore += product.totalScore;
            }

            return acc;
        }, {});

        // 평균 점수 계산
        Object.values(stats).forEach((stat: any) => {
            stat.avgScore = stat.total > 0 ? Math.round(stat.totalScore / stat.total) : 0;
            delete stat.totalScore;
        });

        return Object.values(stats);
    }
}
