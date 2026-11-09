export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  price: number;
  note?: string;
  createdAt: string;
}

