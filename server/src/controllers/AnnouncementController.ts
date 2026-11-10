import { Request, Response } from 'express';
import { AnnouncementService } from '../services/AnnouncementService';
import { NotificationService } from '../services/NotificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AnnouncementController {
  public static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const announcements = await AnnouncementService.getAll();
      res.status(200).json({ success: true, data: announcements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getPublished(req: Request, res: Response): Promise<void> {
    try {
      const announcements = await AnnouncementService.getPublished();
      res.status(200).json({ success: true, data: announcements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const announcement = await AnnouncementService.create(req.body, req.user.id);

      // In-app Notification: Notify all members of the newly created announcement
      try {
        await NotificationService.notifyAllMembers({
          title: `Announcement: ${announcement.title}`,
          message: announcement.content ? announcement.content.slice(0, 110) + '...' : 'A new church announcement has been published.',
          type: 'announcement',
          link: '/announcements',
          metadata: { announcementId: announcement._id },
        });
      } catch (notifErr) {
        console.error('Failed to dispatch announcement notifications:', notifErr);
      }

      res.status(201).json({ success: true, data: announcement });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const announcement = await AnnouncementService.update(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: announcement });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await AnnouncementService.remove(req.params.id as string);
      res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
