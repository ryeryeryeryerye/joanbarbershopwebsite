import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRegister, (req, res) => authController.register(req, res));

// POST /api/v1/auth/login
router.post('/login', validateLogin, (req, res) => authController.login(req, res));

// GET /api/v1/auth/me (yêu cầu xác thực)
router.get('/me', authenticate, (req, res) => authController.getProfile(req, res));

// PUT /api/v1/auth/profile (yêu cầu xác thực)
router.put('/profile', authenticate, (req, res) => authController.updateProfile(req, res));

export const authRoutes = router;

