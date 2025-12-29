import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    회원가입
 * @access  Public
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    로그인
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/v1/auth/verify-send
 * @desc    인증 코드 발송 (Mock)
 * @access  Public
 */
router.post('/verify-send', AuthController.sendVerificationCode);

/**
 * @route   POST /api/v1/auth/verify-code
 * @desc    인증 코드 검증
 * @access  Public
 */
router.post('/verify-code', AuthController.verifyEmail);

/**
 * @route   GET /api/v1/auth/me
 * @desc    현재 사용자 정보 조회
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getCurrentUser);

/**
 * @route   PATCH /api/v1/auth/me
 * @desc    사용자 정보 수정 (이름, 비밀번호)
 * @access  Private
 */
router.patch('/me', authenticate, AuthController.updateProfile);

export default router;
