import mongoose, { Schema } from 'mongoose';
import { IBlogPost } from '../interfaces/IBlogPost';

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    views: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
