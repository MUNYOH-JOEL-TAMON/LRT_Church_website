import { Document, Types } from 'mongoose';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  flierUrl?: string;
  department?: Types.ObjectId;
  maxCapacity?: number;
  registeredAttendees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
