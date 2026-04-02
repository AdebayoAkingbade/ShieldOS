'use client';

import { useEffect, useRef } from 'react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Check } from 'lucide-react';
import gsap from 'gsap';

const plans = [
  { name: 'Professional', price: '$2,500', features: ['Up to 5 Tenants', '1 TB Data Retention', '24/7 Support', 'Standard Analytics'], cta: 'Get Started' },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited Tenants', 'Unlimited Retention', 'Dedicated Architect', 'Advanced AI Detection', 'SAML SSO'], cta: 'Contact Sales', highlight: true },
  { name: 'MSSP Partner', price: 'Volume', features: ['Multi-tier Management', 'White-labeling', 'Billing API', 'SIEM Integration'], cta: 'Join Partner Program' },
];

export default function PricingPage() {
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
          <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em' }}>Pricing</span>
          <h1 style={{ fontSize: '4rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '2rem', letterSpacing: '-0.03em' }}>Transparent pricing, built <br />for enterprise scale.</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '6rem' }}>
            {plans.map((plan) => (
              <div key={plan.name} className="card" style={{ 
                padding: '3rem', 
                border: plan.highlight ? '2px solid var(--primary)' : '1px solid var(--border)',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                zIndex: plan.highlight ? 10 : 1
              }}>
                {plan.highlight && <span style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'uppercase' }}>Most Popular</span>}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</span>
                    {plan.price !== 'Custom' && plan.price !== 'Volume' && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/ mo / tenant</span>}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {plan.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Check size={16} color="var(--primary)" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', padding: '0.75rem' }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
