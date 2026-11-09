import React from 'react';
import { UserProfile } from '../types/profileTypes';

interface ProfileCardProps {
  profile?: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="p-6 bg-dark-card border border-dark-border rounded-xl">
      <h3 className="text-xl font-bold text-white mb-2">Hồ Sơ Cá Nhân</h3>
      <p className="text-gray-300">Tên: {profile?.name || 'Nguyễn Văn A'}</p>
      <p className="text-gray-400 text-sm">Email: {profile?.email || 'user@example.com'}</p>
    </div>
  );
};

