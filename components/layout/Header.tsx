'use client';

import { useAppSelector } from '@/store/hooks';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/Providers';

type HeaderProps = {
  title: string;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
};

export function Header({ title, onToggleSidebar, showMenuButton }: HeaderProps) {
  const { tenant } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const getSectorAndDate = () => {
    const isNg = tenant?.slug === 'cbn-ng';
    const sector = isNg ? 'Government' : 'Financial sector';
    const date = 'April 2026';
    return `${tenant?.name} - ${sector} - ${date}`;
  };

  return (
    <header
      className="header-bar"
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 55,
        width: '100%',
        marginLeft: 0,
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <button
          aria-label="Open navigation"
          onClick={onToggleSidebar}
          className="mobile-menu-button"
          style={{
            display: showMenuButton ? 'inline-flex' : 'none',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <h1 style={{ fontSize: 'min(1.2rem, 5vw)', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h1>
          <span style={{ fontSize: 'min(0.7rem, 3.5vw)', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {getSectorAndDate()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Bolanle A.</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>CISO</p>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0 }}>
            BA
          </div>
        </div>
      </div>
    </header>
  );
}
