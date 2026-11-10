import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  /**
   * GET /api/v1/notifications
   * Get all notifications for the authenticated user
   */
  public static async getMyNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const data = await NotificationService.getUserNotifications(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Mark a notification as read
   */
  public static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const updated = await NotificationService.markAsRead(req.params.id as string, req.user.id);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * PATCH /api/v1/notifications/mark-all-read
   * Mark all notifications for the current user as read
   */
  public static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      await NotificationService.markAllAsRead(req.user.id);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * DELETE /api/v1/notifications/:id
   * Delete a single notification
   */
  public static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      await NotificationService.deleteNotification(req.params.id as string, req.user.id);
      res.status(200).json({ success: true, message: 'Notification removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * DELETE /api/v1/notifications
   * Clear all notifications for the current user
   */
  public static async clearAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      await NotificationService.clearAll(req.user.id);
      res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/v1/notifications/broadcast
   * Broadcast an in-app notification to all members (Admin only)
   */
  public static async broadcast(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, message, type, link } = req.body;
      if (!title || !message) {
        res.status(400).json({ success: false, message: 'Title and message are required' });
        return;
      }
      await NotificationService.notifyAllMembers({
        title,
        message,
        type: type || 'system',
        link,
      });
      res.status(200).json({ success: true, message: 'Notification broadcasted to all members' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
