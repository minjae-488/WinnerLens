import { Router } from 'express';
import { trendController } from '../controllers/trend.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 트렌드 라우트에 인증 적용
router.use(authenticate);

router.get('/', trendController.getTrends);

export default router;
