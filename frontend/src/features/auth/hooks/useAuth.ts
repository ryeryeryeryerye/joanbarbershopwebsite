import { useState } from 'react';
import { User } from '../types/authTypes';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: Boolean(user),
  };
}

