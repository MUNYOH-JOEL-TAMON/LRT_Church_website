import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public: anyone can read published posts
router.get('/public', BlogController.getPublished);
router.get('/public/:id', BlogController.getById);

// Protected: Admin/Editor can manage all posts
router.use(protect);
router.use(authorize('Admin', 'Editor'));

router.get('/', BlogController.getAll);
router.post('/', BlogController.create);
router.put('/:id', BlogController.update);
router.delete('/:id', BlogController.remove);

export default router;
