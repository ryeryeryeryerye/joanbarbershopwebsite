import React from 'react';
import { DashboardSummary } from '../types/adminTypes';

interface AdminStatsProps {
  stats?: DashboardSummary;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-dark-card border border-dark-border rounded-lg">
        <p className="text-gray-400 text-sm">Tổng lịch hẹn</p>
        <p className="text-2xl font-bold text-white">{stats?.totalAppointments || 0}</p>
      </div>
      <div className="p-4 bg-dark-card border border-dark-border rounded-lg">
        <p className="text-gray-400 text-sm">Doanh thu dự kiến</p>
        <p className="text-2xl font-bold text-primary">{stats?.totalRevenue || 0} ₫</p>
      </div>
      <div className="p-4 bg-dark-card border border-dark-border rounded-lg">
        <p className="text-gray-400 text-sm">Khách hàng</p>
        <p className="text-2xl font-bold text-white">{stats?.totalCustomers || 0}</p>
      </div>
    </div>
  );
};

