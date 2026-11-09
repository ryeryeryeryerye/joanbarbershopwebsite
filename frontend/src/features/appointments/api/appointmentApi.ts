import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { Appointment } from '../types/appointmentTypes';

export const appointmentApi = {
  getMyAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    return axiosClient.get('/appointments/my');
  },
  getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
    return axiosClient.get(`/appointments/${id}`);
  },
  cancelAppointment: async (id: string, reason?: string): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.patch(`/appointments/${id}/cancel`, { reason });
  },
};

