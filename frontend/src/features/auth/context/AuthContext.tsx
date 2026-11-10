import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { User, LoginCredentials, RegisterPayload, UpdateProfilePayload } from '../types/authTypes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục session người dùng khi load trang nếu có token trong localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response.data) {
          const userData = response.data;
          // Chuẩn hóa ID nếu backend trả về _id
          const formattedUser: User = {
            id: (userData as unknown as { _id?: string })._id || userData.id,
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            email: userData.email,
            avatarUrl: userData.avatarUrl,
          };
          setUser(formattedUser);
        }
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await authApi.login(credentials);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const res = await authApi.updateProfile(payload);
    const updated = res.data;
    const formattedUser: User = {
      id: (updated as unknown as { _id?: string })._id || updated.id,
      name: updated.name,
      phone: updated.phone,
      role: updated.role,
      email: updated.email,
      avatarUrl: updated.avatarUrl,
    };
    setUser(formattedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

