import { Schema, model, Document } from 'mongoose';

export interface IBarber extends Document {
  name: string;
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialty: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const barberSchema = new Schema<IBarber>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    experienceYears: { type: Number, default: 3 },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    specialty: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BarberModel = model<IBarber>('Barber', barberSchema);

