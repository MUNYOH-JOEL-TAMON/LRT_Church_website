import { Document, Types } from 'mongoose';

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  headOfDepartment?: Types.ObjectId; // Ref User
  createdAt: Date;
  updatedAt: Date;
}
