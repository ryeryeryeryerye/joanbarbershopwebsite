import { Router } from 'express';
import { authRoutes } from './auth.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'barbershop-backend',
  });
});

// Mount modules
router.use('/auth', authRoutes);

export const apiRouter = router;

