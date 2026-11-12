import { Router } from 'express';
import { getAllBarbers, getBarberById } from '../controllers/barber.controller';

const router = Router();

router.get('/', getAllBarbers);
router.get('/:id', getBarberById);

export const barberRoutes = router;

