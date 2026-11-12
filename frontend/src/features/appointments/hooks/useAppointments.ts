import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types/appointmentTypes';
import { appointmentApi } from '../api/appointmentApi';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading]       = useState<boolean>(true);
  const [error, setError]               = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await appointmentApi.getMyAppointments();
      const list: Appointment[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setAppointments(list);
    } catch {
      setError('Không thể tải danh sách lịch hẹn. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateAppointment = async (
    id: string,
    data: {
      date?: string;
      timeSlot?: string;
      note?: string;
      barberName?: string;
      barberId?: string;
      serviceId?: string;
      serviceName?: string;
      servicePrice?: number;
    }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await appointmentApi.updateAppointment(id, data);
    const updated: Appointment = res?.data || res;
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, ...updated } : a))
    );
    return updated;
  };

  const cancelAppointment = async (id: string) => {
    await appointmentApi.cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const deleteAppointment = async (id: string) => {
    await appointmentApi.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  };

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  };
}
