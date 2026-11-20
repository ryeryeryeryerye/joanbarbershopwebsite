import { Router } from 'express';
import {
  getAllBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber,
} from '../controllers/barber.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllBarbers);
router.get('/:id', getBarberById);
router.post('/', authenticate, authorize(['admin']), createBarber);
router.put('/:id', authenticate, authorize(['admin']), updateBarber);
router.delete('/:id', authenticate, authorize(['admin']), deleteBarber);

export const barberRoutes = router;
