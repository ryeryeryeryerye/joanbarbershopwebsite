import { useState } from 'react';
import { Service } from '../types/serviceTypes';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    services,
    setServices,
    isLoading,
    setIsLoading,
  };
}

