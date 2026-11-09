import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '@/components/shared';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-zinc-100 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;

