'use client';

import Link from 'next/link';

export function MarketingHeader() {
  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 4rem',
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          ShieldOS
        </Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {['Platform', 'Solutions', 'Pricing', 'Resources'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`}
              style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link 
          href="/login" 
          style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}
        >
          Sign in
        </Link>
        <Link 
          href="/login" 
          style={{
            padding: '0.625rem 1.25rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
