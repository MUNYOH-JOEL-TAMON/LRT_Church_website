import { Router } from 'express';
import { GalleryController } from '../controllers/GalleryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public: anyone can view the gallery
router.get('/', GalleryController.getAll);

// Protected: Admin/Editor can upload and delete
router.post('/', protect, authorize('Admin', 'Editor'), GalleryController.create);
router.delete('/:id', protect, authorize('Admin', 'Editor'), GalleryController.remove);

export default router;
