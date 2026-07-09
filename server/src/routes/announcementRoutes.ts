import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public: anyone can view published announcements
router.get('/public', AnnouncementController.getPublished);

// Protected: Admin/Editor can manage all announcements
router.use(protect);
router.use(authorize('Admin', 'Editor'));

router.get('/', AnnouncementController.getAll);
router.post('/', AnnouncementController.create);
router.put('/:id', AnnouncementController.update);
router.delete('/:id', AnnouncementController.remove);

export default router;
