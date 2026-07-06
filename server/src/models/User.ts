import mongoose, { Schema } from 'mongoose';
import { IUser, UserRole } from '../interfaces/IUser';

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
    phoneNumber: { type: String, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
  },
  {
    timestamps: true,
  }
);

// Best Practice Note:
// We do NOT use Mongoose `pre('save')` hooks here to hash passwords.
// Instead, we handle hashing explicitly in the `AuthService`. 
// This keeps our Models purely about data structure and leaves business logic in the Service layer.

export const User = mongoose.model<IUser>('User', UserSchema);
