'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { GridBackground } from '@/components/backgrounds/GridBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#070711] text-[#F7F5FF] relative selection:bg-[#713BFF]/40 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <GridBackground variant="dashboard" />
        <TopBar />
        <main className="flex-1 p-6 md:p-8 pb-32 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
