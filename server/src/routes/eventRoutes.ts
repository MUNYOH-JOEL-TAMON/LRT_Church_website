import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);

// Protected routes (Admin and Editor can create/update/delete events)
router.post('/', protect, authorize('Admin', 'Editor'), EventController.create);
router.put('/:id', protect, authorize('Admin', 'Editor'), EventController.update);
router.delete('/:id', protect, authorize('Admin', 'Editor'), EventController.remove);

// Any authenticated user (Member, etc) can register for an event
router.post('/:id/register', protect, EventController.register);

export default router;
