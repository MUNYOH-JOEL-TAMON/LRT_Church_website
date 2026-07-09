import { BlogPost } from '../models/BlogPost';

export class BlogService {
  public static async getAll() {
    return await BlogPost.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  public static async getPublished() {
    return await BlogPost.find({ status: 'Published' })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  public static async getById(id: string) {
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('createdBy', 'firstName lastName');
    if (!post) throw new Error('Blog post not found');
    return post;
  }

  public static async create(data: any, userId: string) {
    return await BlogPost.create({ ...data, createdBy: userId });
  }

  public static async update(id: string, data: any) {
    const post = await BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!post) throw new Error('Blog post not found');
    return post;
  }

  public static async remove(id: string) {
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) throw new Error('Blog post not found');
    return true;
  }
}
