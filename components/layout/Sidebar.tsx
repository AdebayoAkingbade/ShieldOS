'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Radar,
  Monitor,
  Zap,
  Users,
  Settings,
  ChevronRight,
  X,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Presentation,
  FileBox,
  Terminal,
} from 'lucide-react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { switchTenant, markPathAsViewed, setGlobalLoading } from '@/store/authSlice';
import { tenants } from '@/lib/mock-data';

export function Sidebar({ open, isMobile, onClose }: { open: boolean; isMobile: boolean; onClose: () => void }) {
  const pathname = usePathname() || '';
  const { tenant, viewedPaths } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      dispatch(setGlobalLoading(true));
      setTimeout(() => {
        dispatch(setGlobalLoading(false));
      }, 500);
    }
    if (typeof window !== 'undefined' && window.innerWidth <= 960) {
      onClose();
    }
  };

  useEffect(() => {
    if (pathname) {
      dispatch(markPathAsViewed(pathname));
    }
  }, [pathname, dispatch]);

  const getBadge = (path: string, initialBadge?: number) => {
    if (!initialBadge || viewedPaths.includes(path)) return undefined;
    return initialBadge;
  };

  const overviewItems = [
    { name: 'SOC Control Center', href: '/dashboard', icon: Radar, badge: getBadge('/dashboard', 2) },
    { name: 'Compliance', href: '/compliance', icon: ShieldCheck, badge: getBadge('/compliance', 3) },
    { name: 'SOC Performance', href: '/oversight', icon: Eye, badge: getBadge('/oversight', 5) },
  ];
  
  const opsItems = [
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle, badge: getBadge('/incidents', 7) },
    { name: 'Assets', href: '/assets', icon: Monitor, badge: getBadge('/assets', 12) },
    { name: 'Integrations', href: '/integrations', icon: Zap },
  ];

  const govItems = [
    { name: 'Board Reports', href: '/board-reports', icon: Presentation, badge: getBadge('/board-reports', 1) },
    { name: 'Regulatory Reports', href: '/regulatory', icon: FileBox, badge: getBadge('/regulatory', 4) },
    { name: 'Audit Trail', href: '/audit', icon: Terminal, badge: getBadge('/audit', 24) },
  ];

  const adminItems = [
    { name: 'Users', href: '/users', icon: Users, badge: getBadge('/users', 2) },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSwitch = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const nextTenant = tenants.find(t => t.id === value);
    if (nextTenant) {
      dispatch(switchTenant(nextTenant));
    }
  };

  const renderNavGroup = (title: string, items: any[]) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <p className="sidebar-group-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', padding: '0 1rem', marginBottom: '0.5rem', opacity: 0, transform: 'translateX(-10px)', transition: 'opacity 0.2s, transform 0.2s', whiteSpace: 'nowrap' }}>
        {title}
      </p>
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard');
        const Icon = item.icon;
        const navColor = isActive ? 'var(--text-primary)' : 'var(--text-secondary)';
        const navBackground = isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent';

        return (
          <Link
            key={item.name}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.7rem 0.85rem',
              borderRadius: 'var(--radius)',
              color: navColor,
              background: navBackground,
              fontWeight: isActive ? 500 : 400,
              marginBottom: '0.35rem',
              position: 'relative',
              transition: 'all 0.2s',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.14)' : '1px solid transparent',
              fontSize: '0.875rem',
            }}
            className="nav-link sidebar-link"
            onClick={() => handleNavClick(item.href)}
          >
            <span className="sidebar-link-icon" style={{ position: 'relative' }}>
              <Icon size={18} />
              {item.badge && (
                <span className="sidebar-badge-icon" style={{
                  position: 'absolute', top: -5, right: -5, background: 'var(--risk-high)', color: 'white', fontSize: '0.625rem', fontWeight: 800, minWidth: 15, height: 15, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s'
                }}>
                  {item.badge}
                </span>
              )}
            </span>
            <span className="sidebar-link-label" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '0.6rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
              {item.badge && (
                <span className="sidebar-badge-text" style={{ background: 'rgba(239, 68, 68, 0.14)', color: 'var(--risk-high)', fontSize: '0.7rem', fontWeight: 800, padding: '0.12rem 0.42rem', borderRadius: 10, display: 'none', transition: 'display 0.2s' }}>
                  {item.badge}
                </span>
              )}
            </span>
            {isActive && <ChevronRight className="sidebar-link-chevron" size={14} />}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`sidebar ${isMobile ? 'mobile-sidebar' : 'desktop-sidebar'} ${open ? 'open' : ''}`}
      style={{
        height: '100vh',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 60,
        transition: 'width 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', minHeight: '70px' }}>
        <img src="/logo.svg" alt="Logo" style={{ height: '40px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
        {/* <div className="sidebar-brand-text" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: '0.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>Ostec</h2>
        </div> */}
      </div>

      <div className="sidebar-tenant" style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem', paddingLeft: '0.2rem' }}>Active client</p>
        <Select
          value={tenant?.id || tenants[0].id}
          onChange={handleSwitch}
          size="small"
          displayEmpty
          sx={{
            width: '100%',
            color: 'var(--text-primary)',
            background: 'var(--bg-dark)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 800,
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-focus)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
            '.MuiSvgIcon-root': { fill: 'var(--text-secondary)' }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                '& .MuiMenuItem-root': { fontSize: '0.8125rem', fontWeight: 800 },
                '& .MuiMenuItem-root:hover': { bgcolor: 'var(--surface-hover)' },
                '& .Mui-selected': { bgcolor: 'var(--primary-light) !important', color: 'var(--primary)' }
              }
            }
          }}
        >
          {tenants.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </Select>
      </div>

      <nav className="sidebar-nav-scroll" style={{ flex: 1, padding: '1.5rem 0.75rem', overflowY: 'auto' }}>
        {renderNavGroup('Overview', overviewItems)}
        {renderNavGroup('Operations', opsItems)}
        {renderNavGroup('Governance', govItems)}
        {renderNavGroup('Admin', adminItems)}
      </nav>

      <div className="sidebar-user" style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
            BA
          </div>
          <div className="sidebar-user-copy" style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bolanle A.</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CISO</p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .desktop-sidebar:hover .sidebar-group-title { opacity: 1 !important; transform: translateX(0) !important; }
        .desktop-sidebar:hover .sidebar-badge-icon { opacity: 0; pointer-events: none; }
        .desktop-sidebar:hover .sidebar-badge-text { display: inline-flex !important; }
        .desktop-sidebar .sidebar-nav-scroll::-webkit-scrollbar { width: 4px; }
        .desktop-sidebar .sidebar-nav-scroll::-webkit-scrollbar-thumb { background: transparent; }
        .desktop-sidebar:hover .sidebar-nav-scroll::-webkit-scrollbar-thumb { background: var(--border); }
      `}} />
    </aside>
  );
}
