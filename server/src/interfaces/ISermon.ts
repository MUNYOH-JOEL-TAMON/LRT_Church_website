import { Document, Types } from 'mongoose';

export interface ISermon extends Document {
  _id: Types.ObjectId;
  title: string;
  speaker: string;
  datePreached: Date;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
  tags: string[];
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
