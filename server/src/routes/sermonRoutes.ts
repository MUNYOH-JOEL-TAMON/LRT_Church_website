import { Router } from 'express';
import { SermonController } from '../controllers/SermonController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes: Anyone can fetch sermons
router.get('/', SermonController.getAll);
router.get('/:id', SermonController.getById);

// Protected routes: Only Admin, Pastor, and Editor can create new sermons
router.post('/', protect, authorize('Admin', 'Pastor', 'Editor'), SermonController.create);

export default router;
