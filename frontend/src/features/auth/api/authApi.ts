import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { AuthResponse, LoginCredentials, RegisterPayload } from '../types/authTypes';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/login', credentials);
  },
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/register', payload);
  },
  getCurrentUser: async (): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.get('/auth/me');
  },
};

