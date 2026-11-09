import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, default: 30 },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ServiceModel = model<IService>('Service', serviceSchema);

