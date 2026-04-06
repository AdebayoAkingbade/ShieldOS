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
  const { isAuthenticated, isLoading, isGlobalLoading } = useAppSelector((state) => state.auth);
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
    <div className="layout-shell" style={{ minHeight: '100vh', background: 'var(--bg-light)', position: 'relative' }}>
      {isGlobalLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--primary)',
          zIndex: 1000,
          animation: 'loading-bar 1s infinite linear'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes loading-bar { 
              0% { transform: translateX(-100%); } 
              100% { transform: translateX(100%); } 
            }
          `}} />
        </div>
      )}
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
        <div 
          className="system-awareness-strip"
          style={{ 
            background: 'var(--bg-dark)', 
            borderBottom: '1px solid var(--border)',
            padding: '4px 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.65rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            overflowX: 'hidden',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <span style={{ color: 'var(--risk-low)' }}>●</span> SYSTEM STATUS: <span style={{ color: 'var(--text-primary)' }}>SECURE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            MONITORS: <span style={{ color: 'var(--text-primary)' }}>12</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            SYNC: <span style={{ color: 'var(--text-primary)' }}>08:42 UTC</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            NODE: <span style={{ color: 'var(--risk-low)' }}>OS-NX-78</span>
          </div>
        </div>

        <Header
          title={title}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
          showMenuButton={isMobile}
        />

        <main className="main-content" style={{ padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
