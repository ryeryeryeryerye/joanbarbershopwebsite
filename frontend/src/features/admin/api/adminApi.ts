import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import {
  DashboardSummary,
  AdminServiceItem,
  AdminBarberItem,
  AdminAppointmentItem,
  AppointmentStatus,
} from '../types/adminTypes';

export const adminApi = {
  // Thống kê tổng quan
  getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    return axiosClient.get('/admin/dashboard/summary');
  },

  // Quản lý Dịch Vụ (CRUD)
  getAllServices: async (all = true): Promise<ApiResponse<AdminServiceItem[]>> => {
    return axiosClient.get(`/services${all ? '?all=true' : ''}`);
  },
  createService: async (
    data: Partial<AdminServiceItem>
  ): Promise<ApiResponse<AdminServiceItem>> => {
    return axiosClient.post('/services', data);
  },
  updateService: async (
    id: string,
    data: Partial<AdminServiceItem>
  ): Promise<ApiResponse<AdminServiceItem>> => {
    return axiosClient.put(`/services/${id}`, data);
  },
  deleteService: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return axiosClient.delete(`/services/${id}`);
  },

  // Quản lý Thợ Cắt Tóc (CRUD)
  getAllBarbers: async (all = true): Promise<ApiResponse<AdminBarberItem[]>> => {
    return axiosClient.get(`/barbers${all ? '?all=true' : ''}`);
  },
  createBarber: async (
    data: Partial<AdminBarberItem>
  ): Promise<ApiResponse<AdminBarberItem>> => {
    return axiosClient.post('/barbers', data);
  },
  updateBarber: async (
    id: string,
    data: Partial<AdminBarberItem>
  ): Promise<ApiResponse<AdminBarberItem>> => {
    return axiosClient.put(`/barbers/${id}`, data);
  },
  deleteBarber: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return axiosClient.delete(`/barbers/${id}`);
  },

  // Quản lý Đơn Đặt Lịch & Lịch Trình Thợ
  getAllAppointments: async (params?: {
    status?: string;
    date?: string;
    barberId?: string;
  }): Promise<ApiResponse<AdminAppointmentItem[]>> => {
    return axiosClient.get('/appointments', { params });
  },
  updateAppointmentStatus: async (
    id: string,
    status: AppointmentStatus
  ): Promise<ApiResponse<AdminAppointmentItem>> => {
    return axiosClient.patch(`/appointments/${id}/status`, { status });
  },
  updateAppointment: async (
    id: string,
    data: Partial<AdminAppointmentItem>
  ): Promise<ApiResponse<AdminAppointmentItem>> => {
    return axiosClient.put(`/appointments/${id}`, data);
  },
  deleteAppointment: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    return axiosClient.delete(`/appointments/${id}`);
  },
};
