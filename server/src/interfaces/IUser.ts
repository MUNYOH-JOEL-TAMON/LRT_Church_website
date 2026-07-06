import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  PASTOR = 'Pastor',
  EDITOR = 'Editor',
  MEMBER = 'Member',
  VISITOR = 'Visitor',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phoneNumber?: string;
  department?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
