import React from 'react';
import { Calendar, DollarSign, Users, Scissors, UserCheck, Clock, CheckCircle } from 'lucide-react';
import { DashboardSummary } from '../types/adminTypes';

interface AdminStatsProps {
  stats?: DashboardSummary | null;
  onSelectTab?: (tab: 'overview' | 'appointments' | 'schedule' | 'services' | 'barbers') => void;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats, onSelectTab }) => {
  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const statCards: Array<{
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bgIcon: string;
    subtext: string;
    targetTab?: 'overview' | 'appointments' | 'schedule' | 'services' | 'barbers';
  }> = [
    {
      label: 'Tổng Doanh Thu',
      value: formatCurrency(stats?.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-400',
      bgIcon: 'bg-emerald-950/40 border-emerald-800/50',
      subtext: 'Chỉ ghi nhận khi đơn hoàn tất',
      targetTab: 'appointments',
    },
    {
      label: 'Tổng Lịch Hẹn',
      value: stats?.totalAppointments ?? 0,
      icon: Calendar,
      color: 'text-orange-400',
      bgIcon: 'bg-orange-950/40 border-orange-800/50',
      subtext: `Hôm nay: ${stats?.todayAppointments ?? 0} lịch (bấm xem thợ)`,
      targetTab: 'schedule',
    },
    {
      label: 'Chờ Xác Nhận',
      value: stats?.pendingAppointments ?? 0,
      icon: Clock,
      color: 'text-amber-400',
      bgIcon: 'bg-amber-950/40 border-amber-800/50',
      subtext: 'Cần duyệt đơn ngay',
      targetTab: 'appointments',
    },
    {
      label: 'Lịch Đã Hoàn Thành',
      value: stats?.completedAppointments ?? 0,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgIcon: 'bg-blue-950/40 border-blue-800/50',
      subtext: 'Khách đã phục vụ xong',
      targetTab: 'appointments',
    },
    {
      label: 'Khách Hàng',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: 'text-cyan-400',
      bgIcon: 'bg-cyan-950/40 border-cyan-800/50',
      subtext: 'Tài khoản thành viên',
    },
    {
      label: 'Đội Ngũ Thợ',
      value: stats?.totalBarbers ?? 0,
      icon: UserCheck,
      color: 'text-purple-400',
      bgIcon: 'bg-purple-950/40 border-purple-800/50',
      subtext: 'Đang hoạt động tại shop',
      targetTab: 'barbers',
    },
    {
      label: 'Gói Dịch Vụ',
      value: stats?.totalServices ?? 0,
      icon: Scissors,
      color: 'text-rose-400',
      bgIcon: 'bg-rose-950/40 border-rose-800/50',
      subtext: 'Dịch vụ đang phục vụ',
      targetTab: 'services',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.targetTab && onSelectTab);

        return (
          <div
            key={idx}
            onClick={() => {
              if (card.targetTab && onSelectTab) {
                onSelectTab(card.targetTab);
              }
            }}
            className={`p-4 rounded bg-dark-card border border-dark-border transition-all duration-200 flex flex-col justify-between ${
              isClickable ? 'cursor-pointer hover:border-cta-orange hover:-translate-y-0.5' : 'hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2 rounded border ${card.bgIcon} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
              <span>{card.subtext}</span>
              {isClickable && <span className="text-orange-400 font-bold">&rarr;</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
};
