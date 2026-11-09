import { Schema, model, Document, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface IAppointment extends Document {
  customerId: Types.ObjectId;
  barberId: Types.ObjectId;
  serviceId: Types.ObjectId;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  price: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    price: { type: Number, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AppointmentModel = model<IAppointment>('Appointment', appointmentSchema);

