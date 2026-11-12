import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingStepData, BookingResult } from '../types/bookingTypes';
import { useAuth } from '@/features/auth';
import { axiosClient } from '@/lib';
import { CANONICAL_SERVICES } from '@/features/services';

export function useBooking() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<BookingStepData>(() => ({
    date: new Date().toISOString().split('T')[0],
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
  }));
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tự động nhận diện dịch vụ từ URL query parameter nếu có (?serviceId=...)
  useEffect(() => {
    const sId = searchParams.get('serviceId');
    if (sId) {
      const found = CANONICAL_SERVICES.find((s) => s.id === sId);
      if (found) {
        setBookingData((prev) => ({
          ...prev,
          serviceId: found.id,
          serviceName: found.name,
          servicePrice: found.price,
          serviceDuration: found.durationMinutes,
          serviceImage: found.imageUrl,
        }));
      }
    }
  }, [searchParams]);

  // Tự động đồng bộ thông tin khách hàng từ tài khoản đăng nhập
  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  const updateBookingData = (data: Partial<BookingStepData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber <= step) {
      setStep(stepNumber);
    }
  };

  const canProceed = (): boolean => {
    if (step === 1) return Boolean(bookingData.serviceId || bookingData.serviceName);
    if (step === 2) return Boolean(bookingData.barberId || bookingData.barberName);
    if (step === 3) return Boolean(bookingData.date && bookingData.timeSlot);
    if (step === 4) {
      return Boolean(
        bookingData.customerName?.trim() &&
        bookingData.customerPhone?.trim() &&
        bookingData.customerPhone.length >= 9
      );
    }
    return true;
  };

  // Gọi API backend lưu đơn vào MongoDB
  const confirmBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        serviceId:     bookingData.serviceId,
        serviceName:   bookingData.serviceName,
        servicePrice:  bookingData.servicePrice,
        barberId:      bookingData.barberId,
        barberName:    bookingData.barberName,
        date:          bookingData.date,
        timeSlot:      bookingData.timeSlot,
        note:          bookingData.customerNote || '',
        customerName:  bookingData.customerName || user?.name || '',
        customerPhone: bookingData.customerPhone || user?.phone || '',
      };

      // axiosClient response interceptor returns response.data directly: { success, message, data }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await axiosClient.post('/appointments', payload);
      const saved = res?.data || res;

      const codeSuffix = saved?._id ? String(saved._id).slice(-6).toUpperCase() : `${Math.floor(100000 + Math.random() * 900000)}`;
      const result: BookingResult = {
        bookingCode:   `BS-${codeSuffix}`,
        serviceName:   saved?.serviceName  || bookingData.serviceName  || 'Dịch vụ Barbershop',
        barberName:    saved?.barberName   || bookingData.barberName   || 'Thợ Bất Kỳ',
        dateTime:      `${saved?.timeSlot || bookingData.timeSlot || '09:00'} ngày ${saved?.date || bookingData.date || 'Hôm nay'}`,
        totalPrice:    saved?.price        || bookingData.servicePrice || 150000,
        customerName:  saved?.customerName || bookingData.customerName || '',
        customerPhone: saved?.customerPhone || bookingData.customerPhone || '',
      };

      setBookingResult(result);
      setIsCompleted(true);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorObj = err as any;
      const msg = errorObj?.message || errorObj?.response?.data?.message || 'Đặt lịch thất bại. Vui lòng kiểm tra lại kết nối.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setBookingData({
      date: new Date().toISOString().split('T')[0],
      customerName: user?.name || '',
      customerPhone: user?.phone || '',
    });
    setIsCompleted(false);
    setBookingResult(null);
    setSubmitError(null);
  };

  return {
    step,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    confirmBooking,
    isCompleted,
    bookingResult,
    resetBooking,
    isSubmitting,
    submitError,
  };
}
