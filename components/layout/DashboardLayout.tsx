'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

export function DashboardLayout({ 
  children, 
  title 
}: { 
  children: React.ReactNode;
  title: string;
}) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 960px)');

    const updateViewport = (event?: MediaQueryListEvent) => {
      const mobile = event ? event.matches : mediaQuery.matches;
      setIsMobile(mobile);
      setIsSidebarOpen(false);
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

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

  const sidebarOffset = isMobile ? 0 : 76;

  return (
    <div className="layout-shell" style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Sidebar
        open={isMobile ? isSidebarOpen : true}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
            zIndex: 50
          }}
        />
      )}

      <div
        className="app-frame"
        style={{
          marginLeft: sidebarOffset,
          width: `calc(100% - ${sidebarOffset}px)`,
        }}
      >
        <Header
          title={title}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
          showMenuButton={isMobile}
        />

        <main className="main-content" style={{ padding: '1.25rem 2rem' }}>
          <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
