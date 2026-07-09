import { Document, Types } from 'mongoose';

export interface IGalleryImage extends Document {
  _id: Types.ObjectId;
  title: string;
  imageUrl: string;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
