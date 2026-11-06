import { Router, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../utils/multer';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();

/**
 * POST /api/v1/upload
 * Uploads a single image file and returns its public URL.
 * Protected — must be logged in.
 */
router.post(
  '/',
  protect,
  upload.single('image'),
  (req: AuthRequest, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const host = req.get('host') || `localhost:${process.env.PORT || 5000}`;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const dynamicBaseUrl = `${protocol}://${host}`;
    const baseUrl =
      process.env.NODE_ENV === 'production' && process.env.SERVER_URL
        ? process.env.SERVER_URL
        : process.env.SERVER_URL && !process.env.SERVER_URL.includes('onrender.com')
        ? process.env.SERVER_URL
        : dynamicBaseUrl;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({ success: true, imageUrl });
  }
);

export default router;
