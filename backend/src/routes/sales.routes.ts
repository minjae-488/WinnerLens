import { Router } from 'express';
import { salesController } from '../controllers/sales.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// /api/sales
router.get('/', authenticate, (req, res) => salesController.getSalesData(req, res));

export default router;
