import mongoose, { Document, Schema } from 'mongoose';
import { IAuth } from '@/interfaces/auth.interface';

interface IAuthDocument extends IAuth, Document {}

const AuthSchema = new Schema<IAuthDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Auth = mongoose.model<IAuthDocument>('Auth', AuthSchema);

export default Auth;
