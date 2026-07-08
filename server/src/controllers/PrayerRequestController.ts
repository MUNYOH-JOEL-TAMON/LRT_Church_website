import { Request, Response } from 'express';
import { PrayerRequestService } from '../services/PrayerRequestService';
import { AuthRequest } from '../middleware/authMiddleware';

export class PrayerRequestController {
  /**
   * Create a prayer request
   * POST /api/v1/prayer-requests
   */
  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      // If user is authenticated, attach their ID, otherwise it's null
      const userId = req.user ? req.user.id : undefined;
      const request = await PrayerRequestService.create(req.body, userId);
      
      res.status(201).json({ success: true, data: request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Get all prayer requests (For Admins/Pastors)
   * GET /api/v1/prayer-requests
   */
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const requests = await PrayerRequestService.getAll();
      res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get public prayer requests
   * GET /api/v1/prayer-requests/public
   */
  public static async getPublic(req: Request, res: Response): Promise<void> {
    try {
      const requests = await PrayerRequestService.getPublic();
      res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update prayer request status
   * PUT /api/v1/prayer-requests/:id/status
   */
  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const request = await PrayerRequestService.updateStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, data: request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
