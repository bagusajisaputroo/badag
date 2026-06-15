"use client";
import React from 'react';
import DeviceFrame from '../../components/layout/DeviceFrame';
import AdminBottomNav from '../../components/layout/AdminBottomNav';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <DeviceFrame activeTab={pathname}>
      {children}
      {!isLoginPage && <AdminBottomNav />}
    </DeviceFrame>
  );
}
