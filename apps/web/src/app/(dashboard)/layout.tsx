'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0B0819] text-white items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#7047EB] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#EAE5F5]">Loading workspace...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Use effect-safe redirect
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return (
      <div className="flex min-h-screen bg-[#0B0819] text-white items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#7047EB] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#EAE5F5]">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B0819] text-white relative selection:bg-[#7047EB]/40 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        <main className="flex-1 p-6 md:p-8 pb-32 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
