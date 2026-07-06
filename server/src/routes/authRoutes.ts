import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Map POST /api/v1/auth/register to the controller method
router.post('/register', AuthController.register);

// Map POST /api/v1/auth/login to the controller method
router.post('/login', AuthController.login);

export default router;
