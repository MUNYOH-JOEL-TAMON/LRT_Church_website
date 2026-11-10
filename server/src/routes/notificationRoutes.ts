import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// All notification routes require authentication
router.use(protect);

router.get('/', NotificationController.getMyNotifications);
router.patch('/mark-all-read', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);
router.delete('/', NotificationController.clearAll);

// Admin-only broadcast
router.post('/broadcast', authorize('Admin'), NotificationController.broadcast);

export default router;
