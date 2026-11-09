import React from 'react';
import { Button } from '@/components/ui';

export const LoginForm: React.FC = () => {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-dark-card border border-dark-border rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">Đăng Nhập</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Khung tính năng Xác thực tài khoản (Scaffold Placeholder).
      </p>
      <div className="flex justify-center">
        <Button className="w-full">Đăng nhập</Button>
      </div>
    </div>
  );
};

