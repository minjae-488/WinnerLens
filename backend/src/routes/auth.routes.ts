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
 * @route   GET /api/v1/auth/me
 * @desc    현재 사용자 정보 조회
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
