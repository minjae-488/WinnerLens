import { Router } from 'express';
import { InspectionController } from '../controllers/inspection.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/inspection/inspect
 * @desc    상품 정보 검수
 * @access  Private
 */
router.post('/inspect', authenticate, InspectionController.inspect);

export default router;
