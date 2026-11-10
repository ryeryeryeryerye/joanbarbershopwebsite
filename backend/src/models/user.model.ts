import { Schema, model, Document } from 'mongoose';

export type UserRole = 'customer' | 'barber' | 'admin';

export interface IUser extends Document {
  name: string;
  email?: string;
  password: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['customer', 'barber', 'admin'], default: 'customer' },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);

