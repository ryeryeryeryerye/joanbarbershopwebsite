import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { Barber } from '../types/barberTypes';

export const barberApi = {
  getAllBarbers: async (): Promise<ApiResponse<Barber[]>> => {
    return axiosClient.get('/barbers');
  },
  getBarberById: async (id: string): Promise<ApiResponse<Barber>> => {
    return axiosClient.get(`/barbers/${id}`);
  },
};

