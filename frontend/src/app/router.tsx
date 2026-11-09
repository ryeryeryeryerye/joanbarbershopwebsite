import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { HomePage } from './HomePage';
import { LoginForm } from '@/features/auth';
import { BookingCard } from '@/features/booking';
import { AppointmentList } from '@/features/appointments';
import { ProfileCard } from '@/features/profile';
import { AdminStats } from '@/features/admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth/login',
        element: <LoginForm />,
      },
      {
        path: 'booking',
        element: <BookingCard />,
      },
      {
        path: 'appointments',
        element: <AppointmentList />,
      },
      {
        path: 'profile',
        element: <ProfileCard />,
      },
      {
        path: 'admin',
        element: (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Bảng Điều Khiển Quản Trị</h2>
            <AdminStats />
          </div>
        ),
      },
    ],
  },
]);
