import { PrayerRequest } from '../models/PrayerRequest';

export class PrayerRequestService {
  /**
   * Create a new prayer request
   */
  public static async create(data: any, userId?: string) {
    const { subject, details, isAnonymous, isPrivate } = data;

    const request = await PrayerRequest.create({
      subject,
      details,
      isAnonymous: Boolean(isAnonymous),
      isPrivate: Boolean(isPrivate),
      requestedBy: userId || null,
    });

    return request;
  }

  /**
   * Get all prayer requests (Admin/Pastor view)
   */
  public static async getAll() {
    return await PrayerRequest.find().populate('requestedBy', 'firstName lastName email').sort({ createdAt: -1 });
  }

  /**
   * Get public prayer requests
   */
  public static async getPublic() {
    return await PrayerRequest.find({ isPrivate: false }).populate('requestedBy', 'firstName lastName').sort({ createdAt: -1 });
  }

  /**
   * Update prayer request status
   */
  public static async updateStatus(id: string, status: string) {
    const validStatuses = ['Pending', 'Praying', 'Answered'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const request = await PrayerRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      throw new Error('Prayer request not found');
    }
    return request;
  }
}
