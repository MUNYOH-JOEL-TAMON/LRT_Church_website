import mongoose, { Schema } from 'mongoose';
import { IGalleryImage } from '../interfaces/IGalleryImage';

const GalleryImageSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const GalleryImage = mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
