import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

interface IUserDocument extends Omit<IUser, 'id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    contacts: { type: [String], required: true }
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
