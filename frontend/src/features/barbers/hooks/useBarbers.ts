import { useState } from 'react';
import { Barber } from '../types/barberTypes';

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    barbers,
    setBarbers,
    isLoading,
    setIsLoading,
  };
}

