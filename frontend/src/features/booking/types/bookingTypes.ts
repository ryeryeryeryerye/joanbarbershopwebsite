export interface BookingStepData {
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  serviceDuration?: number;
  serviceImage?: string;

  barberId?: string;
  barberName?: string;
  barberTitle?: string;
  barberImage?: string;

  date?: string;
  timeSlot?: string;

  customerName?: string;
  customerPhone?: string;
  customerNote?: string;
}

export interface CreateBookingPayload {
  serviceId: string;
  barberId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  note?: string;
}

export interface BookingResult {
  bookingCode: string;
  serviceName: string;
  barberName: string;
  dateTime: string;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
}
