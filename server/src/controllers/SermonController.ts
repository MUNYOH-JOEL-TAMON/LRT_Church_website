import { Request, Response } from 'express';
import { SermonService } from '../services/SermonService';
import { AuthRequest } from '../middleware/authMiddleware';

export class SermonController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sermons = await SermonService.getAllSermons();
      res.status(200).json({ success: true, data: sermons });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      // req.user is populated by the 'protect' middleware.
      // We automatically assign the 'uploadedBy' field to the user creating it.
      const data = { ...req.body, uploadedBy: req.user.id };
      const sermon = await SermonService.createSermon(data);
      res.status(201).json({ success: true, data: sermon });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const sermon = await SermonService.getSermonById(req.params.id as string);
      res.status(200).json({ success: true, data: sermon });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  public static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const sermon = await SermonService.updateSermon(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: sermon });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await SermonService.deleteSermon(req.params.id as string);
      res.status(200).json({ success: true, message: 'Sermon deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
