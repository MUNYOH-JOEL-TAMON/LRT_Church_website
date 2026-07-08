import { Router } from 'express';
import { PrayerRequestController } from '../controllers/PrayerRequestController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Publicly accessible routes
router.get('/public', PrayerRequestController.getPublic);
// Anyone can submit a prayer request, but we can optionally extract the user if they pass a token.
// To allow optional auth, we would need a custom middleware, but for now we will just let it be public and not attach the user unless they provide it.
// Actually, let's just make creation public, the controller checks for req.user if it exists.
// We can use an optional auth middleware, but for simplicity, we'll leave it without `protect` and just assume anonymous if not logged in.
// Note: To attach user, the frontend should still send the Authorization header if they are logged in.
// We will create an optionalAuth middleware inline or just skip it for now and handle anonymous requests.
import { AuthRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';

const optionalAuth = (req: AuthRequest, res: any, next: any) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
    } catch (error) {}
  }
  next();
};

router.post('/', optionalAuth, PrayerRequestController.create);

// Protected routes for Admins and Pastors
router.use(protect);
router.use(authorize('Admin', 'Pastor'));

router.get('/', PrayerRequestController.getAll);
router.put('/:id/status', PrayerRequestController.updateStatus);

export default router;
