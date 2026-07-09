import { GalleryImage } from '../models/GalleryImage';

export class GalleryService {
  public static async getAll() {
    return await GalleryImage.find()
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  public static async create(data: any, userId: string) {
    return await GalleryImage.create({ ...data, uploadedBy: userId });
  }

  public static async remove(id: string) {
    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) throw new Error('Image not found');
    return true;
  }
}
