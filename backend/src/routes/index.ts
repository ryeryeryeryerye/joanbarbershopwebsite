import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { appointmentRoutes } from './appointment.routes';
import { serviceRoutes } from './service.routes';
import { barberRoutes } from './barber.routes';

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
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/barbers', barberRoutes);

export const apiRouter = router;


