import { Request, Response } from 'express';
import { GalleryService } from '../services/GalleryService';
import { AuthRequest } from '../middleware/authMiddleware';

export class GalleryController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const images = await GalleryService.getAll();
      res.status(200).json({ success: true, data: images });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const image = await GalleryService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: image });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await GalleryService.remove(req.params.id as string);
      res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
