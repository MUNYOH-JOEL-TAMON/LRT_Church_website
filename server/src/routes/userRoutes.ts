import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// All user management routes require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', UserController.getAll);
router.put('/:id/role', UserController.updateRole);
router.delete('/:id', UserController.remove);

export default router;
