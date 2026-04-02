'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Database,
  BarChart3,
  Users,
  Settings,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', href: '/incidents', icon: ShieldAlert },
  { name: 'Assets', href: '/assets', icon: Database },
  { name: 'Integrations', href: '/integrations', icon: Zap },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { tenant } = useAppSelector((state) => state.auth);

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-card)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>ShieldOS</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {tenant?.name || 'Loading...'}
        </p>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 0.75rem' }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                marginBottom: '0.5rem',
                transition: 'all 0.2s'
              }}
              className="nav-link"
            >
              <Icon size={20} style={{ marginRight: '0.75rem' }} />
              <span style={{ flex: 1 }}>{item.name}</span>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem'
          }}>
            A
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bolanle Admin</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
