import mongoose, { Schema } from 'mongoose';
import { ISermon } from '../interfaces/ISermon';

const SermonSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    datePreached: { type: Date, required: true },
    videoUrl: { type: String, trim: true },
    audioUrl: { type: String, trim: true },
    notes: { type: String },
    tags: [{ type: String, trim: true }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Sermon = mongoose.model<ISermon>('Sermon', SermonSchema);
