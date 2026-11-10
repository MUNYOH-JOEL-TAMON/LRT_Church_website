import mongoose, { Schema } from 'mongoose';
import { IBroadcast } from '../interfaces/IBroadcast';

const BroadcastSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    preacher: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['offline', 'scheduled', 'live'],
      default: 'offline',
      index: true,
    },
    sourceType: {
      type: String,
      enum: ['youtube', 'facebook', 'direct'],
      default: 'youtube',
    },
    streamUrl: { type: String, required: true, trim: true },
    allowWebcams: { type: Boolean, default: true },
    accessLevel: {
      type: String,
      enum: ['all', 'registered_only'],
      default: 'all',
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    spotlightedMemberId: { type: String, default: null },
    scheduledDate: { type: Date },
    startedAt: { type: Date },
    endedAt: { type: Date },
    activeViewersCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Broadcast = mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);

