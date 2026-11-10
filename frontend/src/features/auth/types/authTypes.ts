import { Role } from '@/types';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
