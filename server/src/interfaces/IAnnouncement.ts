import { Document, Types } from 'mongoose';

export interface IAnnouncement extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  status: 'Draft' | 'Published';
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
