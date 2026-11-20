import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, authorize(['admin']), createService);
router.put('/:id', authenticate, authorize(['admin']), updateService);
router.delete('/:id', authenticate, authorize(['admin']), deleteService);

export const serviceRoutes = router;
