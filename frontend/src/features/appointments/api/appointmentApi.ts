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
  updateAppointment: async (
    id: string,
    data: {
      date?: string;
      timeSlot?: string;
      note?: string;
      barberName?: string;
      barberId?: string;
      serviceId?: string;
      serviceName?: string;
      servicePrice?: number;
    }
  ): Promise<ApiResponse<Appointment>> => {
    return axiosClient.put(`/appointments/${id}`, data);
  },
  cancelAppointment: async (id: string, reason?: string): Promise<ApiResponse<{ message: string }>> => {
    return axiosClient.patch(`/appointments/${id}/cancel`, { reason });
  },
  deleteAppointment: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return axiosClient.delete(`/appointments/${id}`);
  },
};
