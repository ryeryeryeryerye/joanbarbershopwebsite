import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { DashboardSummary } from '../types/adminTypes';

export const adminApi = {
  getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    return axiosClient.get('/admin/dashboard/summary');
  },
};

