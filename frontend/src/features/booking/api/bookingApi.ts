import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { CreateBookingPayload } from '../types/bookingTypes';

export const bookingApi = {
  createBooking: async (payload: CreateBookingPayload): Promise<ApiResponse<{ bookingId: string }>> => {
    return axiosClient.post('/bookings', payload);
  },
  getAvailableSlots: async (barberId: string, date: string): Promise<ApiResponse<string[]>> => {
    return axiosClient.get(`/bookings/slots?barberId=${barberId}&date=${date}`);
  },
};

