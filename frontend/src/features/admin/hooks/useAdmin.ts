import { useState } from 'react';
import { DashboardSummary } from '../types/adminTypes';

export function useAdmin() {
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    stats,
    setStats,
    isLoading,
    setIsLoading,
  };
}

