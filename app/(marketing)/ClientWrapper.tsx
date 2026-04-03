import dynamic from 'next/dynamic';

export const LandingPageClient = dynamic(() => import('./LandingPageClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      background: '#040914',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#475569',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      letterSpacing: '0.1em'
    }}>
      INITIALIZING...
    </div>
  ),
});
