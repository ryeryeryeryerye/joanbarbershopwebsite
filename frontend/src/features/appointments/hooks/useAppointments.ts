import { useState } from 'react';
import { Appointment } from '../types/appointmentTypes';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return {
    appointments,
    setAppointments,
    isLoading,
    setIsLoading,
  };
}

