import { Announcement } from '../models/Announcement';

export class AnnouncementService {
  public static async getAll() {
    return await Announcement.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  public static async getPublished() {
    return await Announcement.find({ status: 'Published' })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  public static async create(data: any, userId: string) {
    return await Announcement.create({ ...data, createdBy: userId });
  }

  public static async update(id: string, data: any) {
    const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!announcement) throw new Error('Announcement not found');
    return announcement;
  }

  public static async remove(id: string) {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new Error('Announcement not found');
    return true;
  }
}
