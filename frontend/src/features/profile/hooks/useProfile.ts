import { useState } from 'react';
import { UserProfile } from '../types/profileTypes';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    profile,
    setProfile,
    isLoading,
    setIsLoading,
  };
}

