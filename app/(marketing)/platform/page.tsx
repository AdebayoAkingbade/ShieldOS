'use client';

import { useEffect, useRef } from 'react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import gsap from 'gsap';

export default function PlatformPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <MarketingHeader />
      <main style={{ padding: '8rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={contentRef}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em' }}>The Platform</span>
          <h1 style={{ fontSize: '4rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '2rem', letterSpacing: '-0.03em' }}>A single pane of glass for<br />complex security stacks.</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6rem', marginTop: '6rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Data Normalization</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                We translate disparate logs from hundreds of vendors into a unified Security Information Model. No more toggling between tabs to understand an incident.
              </p>
            </div>
            <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Interactive Normalization Preview
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', marginTop: '8rem' }}>
            <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Unified Dashboard Visualization
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Real-time Intelligence</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                Leverage our proprietary analytics engine to detect lateral movement and credential theft across hybrid-cloud environments in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
