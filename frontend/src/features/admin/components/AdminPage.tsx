import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Scissors,
  Users,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { DashboardSummary } from '../types/adminTypes';
import { AdminStats } from './AdminStats';
import { AdminAppointmentsTab } from './AdminAppointmentsTab';
import { AdminScheduleTab } from './AdminScheduleTab';
import { AdminServicesTab } from './AdminServicesTab';
import { AdminBarbersTab } from './AdminBarbersTab';

type AdminTab = 'overview' | 'appointments' | 'schedule' | 'services' | 'barbers';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminApi.getDashboardSummary();
      const data = res?.data || (res as unknown as DashboardSummary);
      setStats(data);
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'TỔNG QUAN', icon: LayoutDashboard },
    { id: 'appointments', label: 'ĐƠN ĐẶT LỊCH', icon: CalendarCheck, badge: stats?.pendingAppointments },
    { id: 'schedule', label: 'LỊCH TRÌNH THỢ', icon: CalendarDays },
    { id: 'services', label: 'DỊCH VỤ', icon: Scissors, badge: stats?.totalServices },
    { id: 'barbers', label: 'THỢ CẮT TÓC', icon: Users, badge: stats?.totalBarbers },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cta-orange animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Hệ Thống Quản Trị Joan Barbershop
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Quản lý dịch vụ, đội ngũ thợ, đơn đặt lịch và theo dõi thời gian biểu thực tế
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchStats}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-semibold rounded uppercase tracking-wider transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
              <span>Cập nhật số liệu</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-zinc-800 overflow-x-auto scrollbar-none">
          <div className="flex space-x-1 min-w-max pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cta-orange text-white shadow-md shadow-orange-950/40'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-black/40 text-white'
                          : 'bg-orange-950/60 text-orange-400 border border-orange-800/60'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pt-2 animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AdminStats stats={stats} onSelectTab={setActiveTab} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lối tắt đơn đặt cần duyệt */}
                <div className="p-5 rounded bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-orange-400" />
                      <span>Đơn đặt lịch cần chú ý</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                    >
                      Xem tất cả đơn &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Hiện có <strong className="text-amber-400">{stats?.pendingAppointments || 0}</strong> đơn đang chờ xác nhận. Hãy vào mục <strong>ĐƠN ĐẶT LỊCH</strong> để duyệt hoặc điều phối thợ nhanh chóng.
                  </p>
                </div>

                {/* Lối tắt lịch trình thợ */}
                <div className="p-5 rounded bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-orange-400" />
                      <span>Lịch trình làm việc hôm nay</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                    >
                      Xem sơ đồ khung giờ &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Hôm nay shop có <strong className="text-emerald-400">{stats?.todayAppointments || 0}</strong> lượt khách đã đặt hẹn. Vào mục <strong>LỊCH TRÌNH THỢ</strong> để xem chi tiết từng khung giờ theo thợ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <AdminAppointmentsTab onUpdateStats={fetchStats} />
          )}

          {activeTab === 'schedule' && (
            <AdminScheduleTab onUpdateStats={fetchStats} />
          )}

          {activeTab === 'services' && (
            <AdminServicesTab onUpdateStats={fetchStats} />
          )}

          {activeTab === 'barbers' && (
            <AdminBarbersTab onUpdateStats={fetchStats} />
          )}
        </div>
      </div>
    </div>
  );
};
