import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', EventController.getAll);

// Protected routes (Admin and Editor can create events)
router.post('/', protect, authorize('Admin', 'Editor'), EventController.create);

// Any authenticated user (Member, etc) can register for an event
router.post('/:id/register', protect, EventController.register);

export default router;
