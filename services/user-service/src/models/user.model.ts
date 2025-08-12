import mongoose, { Document, Schema } from 'mongoose';

import { IUser } from '@/interfaces/user.interface';

export interface IUserDocument extends Omit<IUser, 'id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
      index: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format']
    },
    contacts: { type: [mongoose.Types.ObjectId], ref: 'User' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
