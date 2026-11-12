import { Schema, model, Document, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface IAppointment extends Document {
  customerId: Types.ObjectId;
  barberId?: Types.ObjectId;
  serviceId?: Types.ObjectId;
  date: string;        // "YYYY-MM-DD"
  timeSlot: string;    // "HH:mm"
  status: AppointmentStatus;
  price: number;
  note?: string;
  // Snapshot thông tin tại thời điểm đặt (đảm bảo tính toàn vẹn khi xem lại lịch đặt)
  customerName: string;
  customerPhone: string;
  serviceName: string;
  barberName: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    customerId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    barberId:      { type: Schema.Types.ObjectId, ref: 'Barber', required: false },
    serviceId:     { type: Schema.Types.ObjectId, ref: 'Service', required: false },
    date:          { type: String, required: true },
    timeSlot:      { type: String, required: true },
    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    price:         { type: Number, required: true, default: 0 },
    note:          { type: String, default: '' },
    customerName:  { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    serviceName:   { type: String, required: true, trim: true },
    barberName:    { type: String, default: 'Thợ Bất Kỳ', trim: true },
  },
  { timestamps: true }
);

// Index để truy vấn nhanh
appointmentSchema.index({ customerId: 1, createdAt: -1 });
appointmentSchema.index({ barberId: 1, date: 1, timeSlot: 1 });
appointmentSchema.index({ status: 1 });

export const AppointmentModel = model<IAppointment>('Appointment', appointmentSchema);
