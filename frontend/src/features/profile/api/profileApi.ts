import { axiosClient } from '@/lib';
import { ApiResponse } from '@/types';
import { UpdateProfilePayload, UserProfile } from '../types/profileTypes';

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return axiosClient.get('/profile');
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> => {
    return axiosClient.put('/profile', payload);
  },
};

