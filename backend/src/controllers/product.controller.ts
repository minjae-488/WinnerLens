import { Response } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponseUtil } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export class ProductController {
    /**
     * POST /api/v1/products
     * 상품 생성
     */
    static createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const product = await ProductService.createProduct(req.user.userId, req.body);
        return ApiResponseUtil.success(res, product, 201);
    });

    /**
     * GET /api/v1/products
     * 상품 목록 조회 (페이지네이션, 필터링, 정렬)
     */
    static getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const result = await ProductService.getProducts(req.user.userId, req.query as any);
        return ApiResponseUtil.success(res, result);
    });

    /**
     * GET /api/v1/products/:id
     * 상품 상세 조회
     */
    static getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const product = await ProductService.getProductById(req.user.userId, req.params.id);
        return ApiResponseUtil.success(res, product);
    });

    /**
     * PATCH /api/v1/products/:id
     * 상품 수정
     */
    static updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const product = await ProductService.updateProduct(
            req.user.userId,
            req.params.id,
            req.body
        );
        return ApiResponseUtil.success(res, product);
    });

    /**
     * DELETE /api/v1/products/:id
     * 상품 삭제
     */
    static deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const result = await ProductService.deleteProduct(req.user.userId, req.params.id);
        return ApiResponseUtil.success(res, result);
    });

    /**
     * PATCH /api/v1/products/:id/score
     * 상품 스코어 업데이트
     */
    static updateProductScore = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const product = await ProductService.updateProductScore(
            req.user.userId,
            req.params.id,
            req.body
        );
        return ApiResponseUtil.success(res, product);
    });

    /**
     * GET /api/v1/products/stats/categories
     * 카테고리별 통계
     */
    static getCategoryStats = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return ApiResponseUtil.unauthorized(res);
        }

        const stats = await ProductService.getCategoryStats(req.user.userId);
        return ApiResponseUtil.success(res, stats);
    });
}
