'use client';

import { useEffect, useRef } from 'react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import gsap from 'gsap';

export default function SolutionsPage() {
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
          <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em' }}>Solutions</span>
          <h1 style={{ fontSize: '4rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '2rem', letterSpacing: '-0.03em' }}>Tailored security for <br />every industry vertical.</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '6rem 0' }}>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Financial Services</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Secure transactions and customer data with our PCI-DSS compliant analytics platform.
              </p>
            </div>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Healthcare</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Protect sensitive patient records and maintain HIPAA compliance with automated audit trails.
              </p>
            </div>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Public Sector</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                GovCloud integrated monitoring for mission-critical infrastructure and public data sets.
              </p>
            </div>
          </div>

          <div style={{ padding: '4rem', background: 'var(--bg-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Need a custom solution?</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Our security architects can design a platform configuration that fits your unique compliance and infrastructure requirements perfectly.</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>Contact Solutions Architect</button>
          </div>
        </div>
      </main>
    </div>
  );
}
