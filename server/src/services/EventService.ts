import { Event } from '../models/Event';

export class EventService {
  public static async getAllEvents() {
    // Populate the department name so clients know which department is hosting it
    return await Event.find().populate('department', 'name');
  }

  public static async createEvent(data: any) {
    return await Event.create(data);
  }

  public static async getEventById(id: string) {
    const event = await Event.findById(id).populate('department', 'name');
    if (!event) throw new Error('Event not found');
    return event;
  }

  public static async updateEvent(id: string, data: any) {
    const event = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!event) throw new Error('Event not found');
    return event;
  }

  public static async deleteEvent(id: string) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error('Event not found');
    return true;
  }

  public static async registerForEvent(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    // Business Rule: Check capacity
    if (event.maxCapacity && event.registeredAttendees.length >= event.maxCapacity) {
      throw new Error('Event is at full capacity');
    }

    // Check if user is already registered
    if (event.registeredAttendees.includes(userId as any)) {
      throw new Error('User already registered for this event');
    }

    // Register user
    event.registeredAttendees.push(userId as any);
    await event.save();
    return event;
  }
}
