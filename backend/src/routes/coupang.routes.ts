import { Router } from 'express';
import { CoupangController } from '../controllers/coupang.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/coupang/register/:id
 * @desc    상품을 쿠팡에 등록
 * @access  Private
 */
router.post('/register/:id', authenticate, CoupangController.registerProduct);

/**
 * @route   GET /api/v1/coupang/status/:id
 * @desc    쿠팡 상품 상태 조회
 * @access  Private
 */
router.get('/status/:id', authenticate, CoupangController.getProductStatus);

/**
 * @route   PUT /api/v1/coupang/update/:id
 * @desc    쿠팡 상품 정보 업데이트
 * @access  Private
 */
router.put('/update/:id', authenticate, CoupangController.updateProduct);

/**
 * @route   DELETE /api/v1/coupang/delete/:id
 * @desc    쿠팡 상품 삭제 (판매 중지)
 * @access  Private
 */
router.delete('/delete/:id', authenticate, CoupangController.deleteProduct);

/**
 * @route   GET /api/v1/coupang/registerable
 * @desc    등록 가능한 상품 목록 조회
 * @access  Private
 */
router.get('/registerable', authenticate, CoupangController.getRegisterableProducts);

/**
 * @route   GET /api/v1/coupang/registered
 * @desc    등록된 상품 목록 조회
 * @access  Private
 */
router.get('/registered', authenticate, CoupangController.getRegisteredProducts);

export default router;
