import mongoose, { Schema } from 'mongoose';
import { IPrayerRequest } from '../interfaces/IPrayerRequest';

const PrayerRequestSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    request: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ['Pending', 'Praying', 'Answered'], 
      default: 'Pending' 
    },
  },
  { timestamps: true }
);

export const PrayerRequest = mongoose.model<IPrayerRequest>('PrayerRequest', PrayerRequestSchema);
