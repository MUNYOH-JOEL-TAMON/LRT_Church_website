import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../interfaces/IEvent';

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    maxCapacity: { type: Number },
    registeredAttendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
