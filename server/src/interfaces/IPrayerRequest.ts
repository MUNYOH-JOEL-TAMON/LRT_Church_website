import { Document, Types } from 'mongoose';

export interface IPrayerRequest extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId; // Optional for anonymous requests
  request: string;
  isPrivate: boolean;
  status: 'Pending' | 'Praying' | 'Answered';
  createdAt: Date;
  updatedAt: Date;
}
