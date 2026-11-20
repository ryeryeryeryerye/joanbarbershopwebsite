import { Router } from 'express';
import { getDashboardSummary } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard/summary', authenticate, authorize(['admin']), getDashboardSummary);

export const adminRoutes = router;
