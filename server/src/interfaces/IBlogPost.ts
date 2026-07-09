import { Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: string;
  status: 'Draft' | 'Published';
  views: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
