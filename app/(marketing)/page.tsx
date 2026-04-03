// SERVER COMPONENT — no 'use client' so route segment configs are respected
import nextDynamic from 'next/dynamic';

// This tells Next.js to NEVER statically prerender this route.
// Required because the client component uses GSAP + browser-only APIs.
export const dynamic = 'force-dynamic';

// ssr: false ensures GSAP/browser code never runs during server render
const LandingPageClient = nextDynamic(() => import('./LandingPageClient'), {
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

export default function LandingPage() {
  return <LandingPageClient />;
}
