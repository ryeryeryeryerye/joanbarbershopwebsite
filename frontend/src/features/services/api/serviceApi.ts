import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { Service } from '../types/serviceTypes';

export const serviceApi = {
  getAllServices: async (): Promise<ApiResponse<Service[]>> => {
    return axiosClient.get('/services');
  },
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    return axiosClient.get(`/services/${id}`);
  },
};

