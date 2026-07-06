import { Sermon } from '../models/Sermon';

export class SermonService {
  public static async getAllSermons() {
    return await Sermon.find().populate('uploadedBy', 'firstName lastName');
  }

  public static async createSermon(data: any) {
    const sermon = await Sermon.create(data);
    return sermon;
  }

  public static async getSermonById(id: string) {
    const sermon = await Sermon.findById(id).populate('uploadedBy', 'firstName lastName');
    if (!sermon) throw new Error('Sermon not found');
    return sermon;
  }

  public static async updateSermon(id: string, data: any) {
    const sermon = await Sermon.findByIdAndUpdate(id, data, { new: true });
    if (!sermon) throw new Error('Sermon not found');
    return sermon;
  }

  public static async deleteSermon(id: string) {
    const sermon = await Sermon.findByIdAndDelete(id);
    if (!sermon) throw new Error('Sermon not found');
    return true;
  }
}
