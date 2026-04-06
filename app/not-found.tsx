import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';

export default function NotFound() {
  return (
    <div style={{ background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MarketingHeader />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.05em', lineHeight: '1', opacity: 0.1 }}>404</h1>
          <div style={{ marginTop: '-4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Page Not Found</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
              We couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/" className="btn btn-primary">Go Home</Link>
              <Link href="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
        </div>
      </main>
      <footer style={{ padding: '2rem 4rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        &copy; 2026 Ostec Inc. If you think this is a mistake, contact support.
      </footer>
    </div>
  );
}
