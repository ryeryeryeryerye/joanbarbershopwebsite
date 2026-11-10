import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-cta-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md p-8 bg-dark-card border border-dark-border rounded-2xl">
          <h2 className="text-xl font-bold text-red-500 mb-2">Không Có Quyền Truy Cập</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Tài khoản của bạn ({user.role}) không được phép truy cập vào trang này.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 bg-zinc-800 hover:bg-cta-orange text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
          >
            Về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  return children;
};

