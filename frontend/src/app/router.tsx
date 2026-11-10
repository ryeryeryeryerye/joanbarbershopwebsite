import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { HomePage } from './HomePage';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage, RegisterPage } from '@/features/auth';
import { BookingCard } from '@/features/booking';
import { AppointmentList } from '@/features/appointments';
import { ProfilePage } from '@/features/profile';
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
        element: <LoginPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: 'booking',
        element: <BookingCard />,
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute>
            <AppointmentList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Bảng Điều Khiển Quản Trị</h2>
              <AdminStats />
            </div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
