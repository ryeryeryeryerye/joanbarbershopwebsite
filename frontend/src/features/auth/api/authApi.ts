import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '../types/authTypes';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/login', credentials);
  },
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/register', payload);
  },
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return axiosClient.get('/auth/me');
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    return axiosClient.put('/auth/profile', payload);
  },
};
