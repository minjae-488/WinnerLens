import { Router } from 'express';
import { sourcingController } from '../controllers/sourcing.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    sourcingSearchSchema,
    calculatePriceSchema,
    generateListingSchema,
    registerProductSchema,
} from '../validators/sourcing.validator';

const router = Router();

/**
 * 도매 소싱 라우트
 * 
 * 모든 엔드포인트는 인증 필요
 */

/**
 * @route   POST /api/v1/sourcing/search
 * @desc    도매 상품 검색
 * @access  Private
 */
router.post(
    '/search',
    authenticate,
    validate(sourcingSearchSchema),
    (req, res) => sourcingController.searchWholesale(req, res)
);

/**
 * @route   GET /api/v1/sourcing/product/:id
 * @desc    상품 상세 조회
 * @access  Private
 */
router.get(
    '/product/:id',
    authenticate,
    (req, res) => sourcingController.getProductDetail(req, res)
);

/**
 * @route   POST /api/v1/sourcing/calculate-price
 * @desc    가격 계산
 * @access  Private
 */
router.post(
    '/calculate-price',
    authenticate,
    validate(calculatePriceSchema),
    (req, res) => sourcingController.calculatePrice(req, res)
);

/**
 * @route   POST /api/v1/sourcing/generate-listing
 * @desc    AI 리스팅 생성
 * @access  Private
 */
router.post(
    '/generate-listing',
    authenticate,
    validate(generateListingSchema),
    (req, res) => sourcingController.generateListing(req, res)
);

/**
 * @route   POST /api/v1/sourcing/register
 * @desc    쿠팡 등록
 * @access  Private
 */
router.post(
    '/register',
    authenticate,
    validate(registerProductSchema),
    (req, res) => sourcingController.registerToCoupang(req, res)
);

export default router;
