import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { NotificationType } from '../interfaces/INotification';

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Get all notifications for a specific user, along with the count of unread notifications.
   */
  public static async getUserNotifications(userId: string, limit: number = 40) {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return {
      notifications,
      unreadCount,
    };
  }

  /**
   * Mark a single notification as read.
   */
  public static async markAsRead(notificationId: string, userId: string) {
    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    if (!updated) {
      throw new Error('Notification not found or unauthorized');
    }
    return updated;
  }

  /**
   * Mark all notifications as read for a user.
   */
  public static async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );
    return true;
  }

  /**
   * Delete a single notification.
   */
  public static async deleteNotification(notificationId: string, userId: string) {
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
    if (!deleted) {
      throw new Error('Notification not found or unauthorized');
    }
    return true;
  }

  /**
   * Clear all notifications for a user.
   */
  public static async clearAll(userId: string) {
    await Notification.deleteMany({ recipient: userId });
    return true;
  }

  /**
   * Send a notification to all registered users (members and admins).
   */
  public static async notifyAllMembers(input: CreateNotificationInput) {
    const users = await User.find().select('_id').lean();
    if (!users || users.length === 0) return [];

    const notificationsToInsert = users.map((u) => ({
      recipient: u._id,
      title: input.title,
      message: input.message,
      type: input.type || 'system',
      link: input.link,
      metadata: input.metadata,
      isRead: false,
    }));

    return await Notification.insertMany(notificationsToInsert);
  }

  /**
   * Send a notification to a specific user.
   */
  public static async notifyUser(userId: string, input: CreateNotificationInput) {
    return await Notification.create({
      recipient: userId,
      title: input.title,
      message: input.message,
      type: input.type || 'system',
      link: input.link,
      metadata: input.metadata,
      isRead: false,
    });
  }

  /**
   * Send notifications to a specific list of user IDs (e.g. registered event attendees).
   */
  public static async notifyUsers(userIds: any[], input: CreateNotificationInput) {
    if (!userIds || userIds.length === 0) return [];

    const uniqueIds = Array.from(new Set(userIds.map((id) => id.toString())));
    const notificationsToInsert = uniqueIds.map((uid) => ({
      recipient: uid,
      title: input.title,
      message: input.message,
      type: input.type || 'event',
      link: input.link,
      metadata: input.metadata,
      isRead: false,
    }));

    return await Notification.insertMany(notificationsToInsert);
  }
}

