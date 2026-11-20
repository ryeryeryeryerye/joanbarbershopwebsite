export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface DashboardSummary {
  totalAppointments: number;
  totalCustomers: number;
  totalBarbers: number;
  totalServices: number;
  totalRevenue: number;
  pendingAppointments: number;
  confirmedAppointments?: number;
  inProgressAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  todayAppointments?: number;
}

export interface AdminServiceItem {
  _id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminBarberItem {
  _id: string;
  name: string;
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialty: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAppointmentItem {
  _id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  barberId?: string;
  barberName: string;
  serviceId?: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: AppointmentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
