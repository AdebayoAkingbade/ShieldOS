'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardLayout({ 
  children, 
  title 
}: { 
  children: React.ReactNode;
  title: string;
}) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-light)',
        color: 'var(--text-muted)'
      }}>
        Loading platform...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Sidebar />
      <Header title={title} />
      <main style={{ marginLeft: '260px', padding: '1rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
