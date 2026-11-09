import { useState } from 'react';
import { BookingStepData, BookingResult } from '../types/bookingTypes';

export function useBooking() {
  const [step, setStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<BookingStepData>({
    date: new Date().toISOString().split('T')[0],
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

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
    if (step === 1) return Boolean(bookingData.serviceId);
    if (step === 2) return Boolean(bookingData.barberId);
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

  const confirmBooking = () => {
    const randomCode = `BS-${Math.floor(100000 + Math.random() * 900000)}`;
    const result: BookingResult = {
      bookingCode: randomCode,
      serviceName: bookingData.serviceName || 'Dịch vụ Barbershop',
      barberName: bookingData.barberName || 'Thợ ngẫu nhiên',
      dateTime: `${bookingData.timeSlot || '09:00'} ngày ${bookingData.date || 'Hôm nay'}`,
      totalPrice: bookingData.servicePrice || 150000,
      customerName: bookingData.customerName || '',
      customerPhone: bookingData.customerPhone || '',
    };
    setBookingResult(result);
    setIsCompleted(true);
  };

  const resetBooking = () => {
    setStep(1);
    setBookingData({
      date: new Date().toISOString().split('T')[0],
    });
    setIsCompleted(false);
    setBookingResult(null);
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
  };
}
