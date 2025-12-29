import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 AI 라우트는 인증이 필요합니다
router.use(authenticate);

// POST /api/ai/product-name
router.post('/product-name', aiController.generateProductName);

// POST /api/ai/product-description
router.post('/product-description', aiController.generateProductDescription);

export default router;
