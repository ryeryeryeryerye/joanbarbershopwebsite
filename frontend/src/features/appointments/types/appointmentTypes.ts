export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  _id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  date: string;        // "YYYY-MM-DD"
  timeSlot: string;    // "HH:mm"
  status: AppointmentStatus;
  price: number;
  note?: string;
  // Snapshot fields
  customerName?: string;
  customerPhone?: string;
  serviceName?: string;
  barberName?: string;
  createdAt: string;
  updatedAt: string;
}
