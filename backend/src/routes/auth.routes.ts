import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateLoginPayload } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateLoginPayload, (req, res) => authController.login(req, res));
router.get('/me', authenticate, (req, res) => authController.me(req, res));

export const authRoutes = router;

