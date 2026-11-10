import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { NotificationService } from '../services/NotificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export class EventController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const events = await EventService.getAllEvents();
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const event = await EventService.getEventById(req.params.id as string);
      res.status(200).json({ success: true, data: event });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await EventService.createEvent(req.body);

      // In-app Notification: Notify all members of the newly scheduled event
      try {
        const formattedDate = event.date
          ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Upcoming';
        await NotificationService.notifyAllMembers({
          title: `New Event: ${event.title}`,
          message: `${event.description ? event.description.slice(0, 110) + '...' : 'A new event has been scheduled.'} (${formattedDate} • ${event.location})`,
          type: 'event',
          link: '/events',
          metadata: { eventId: event._id },
        });
      } catch (notifErr) {
        console.error('Failed to dispatch event notifications:', notifErr);
      }

      res.status(201).json({ success: true, data: event });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await EventService.registerForEvent(req.params.id as string, req.user.id);
      res.status(200).json({ success: true, data: event, message: 'Successfully registered for event' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await EventService.updateEvent(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: event });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await EventService.deleteEvent(req.params.id as string);
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
