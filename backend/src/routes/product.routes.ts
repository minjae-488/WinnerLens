import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { validateQuery } from '../middleware/validateQuery';
import { authenticate } from '../middleware/auth';
import {
    createProductSchema,
    updateProductSchema,
    updateScoreSchema,
    productQuerySchema,
} from '../validators/product.validator';

const router = Router();

// 모든 상품 라우트는 인증 필요
router.use(authenticate);

/**
 * @route   GET /api/v1/products/stats/categories
 * @desc    카테고리별 통계 조회
 * @access  Private
 */
router.get('/stats/categories', ProductController.getCategoryStats);

/**
 * @route   POST /api/v1/products
 * @desc    상품 생성
 * @access  Private
 */
router.post('/', validate(createProductSchema), ProductController.createProduct);

/**
 * @route   GET /api/v1/products
 * @desc    상품 목록 조회 (페이지네이션, 필터링, 정렬)
 * @access  Private
 */
router.get('/', validateQuery(productQuerySchema), ProductController.getProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    상품 상세 조회
 * @access  Private
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    상품 수정
 * @access  Private
 */
router.patch('/:id', validate(updateProductSchema), ProductController.updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    상품 삭제
 * @access  Private
 */
router.delete('/:id', ProductController.deleteProduct);

/**
 * @route   PATCH /api/v1/products/:id/score
 * @desc    상품 스코어 업데이트
 * @access  Private
 */
router.patch('/:id/score', validate(updateScoreSchema), ProductController.updateProductScore);

export default router;
