import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Map POST /api/v1/auth/register to the controller method
router.post('/register', AuthController.register);

// Map POST /api/v1/auth/login to the controller method
router.post('/login', AuthController.login);

// Map GET /api/v1/auth/me → returns the currently logged-in user's profile
router.get('/me', protect, AuthController.getMe);

// Map PUT /api/v1/auth/profile → updates the currently logged-in user's profile
router.put('/profile', protect, AuthController.updateProfile);

export default router;
