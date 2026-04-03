'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ShieldAlert, Network, Server, PenTool } from 'lucide-react';

export default function LandingPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(btnRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    );

    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.service-card');
      tl.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        '-=0.8'
      );

      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { 
            y: -10, 
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
            borderColor: 'var(--primary)',
            duration: 0.3 
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { 
            y: 0, 
            boxShadow: '0 4px 6px -1px rgb(0, 0, 0, 0.5)',
            borderColor: 'var(--border)',
            duration: 0.3 
          });
        });
      });
    }
  }, []);

  const services = [
    { title: 'Cyber Security', desc: 'Secure your Data and IT Infrastructure with our Next Generation Cyber Security Services', icon: ShieldAlert },
    { title: 'Network Modernisation', desc: 'Build a future ready network to support your digital transformation strategy and cloud adoption.', icon: Network },
    { title: 'Digital Infrastructure', desc: 'Your strategic partner to build the IT Infrastructure that unlocks Performance and unleashes business innovation.', icon: Server },
    { title: 'Managed Services', desc: 'Effective and cost-efficient Monitoring and management of IT systems wherever they are', icon: PenTool },
  ];

  return (
    <div style={{ 
      background: '#040914',
      minHeight: '100vh', 
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '60vh',
        background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.15) 0%, #040914 100%)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '60vh',
        backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.05,
        zIndex: 0,
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)'
      }}></div>

      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 4rem',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.svg" alt="Ostec Logo" style={{ height: '32px' }} />
        </div>
        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <Link href="#" style={{ color: 'white' }}>HOME</Link>
          <Link href="#" style={{ color: '#94A3B8' }}>SERVICES</Link>
          <Link href="#" style={{ color: '#94A3B8' }}>COMPANY</Link>
          <Link href="#" style={{ color: '#94A3B8' }}>SUPPORT</Link>
          <div style={{ borderLeft: '1px solid #334155', margin: '0 1rem' }}></div>
          <Link href="/login" style={{ color: 'var(--primary)' }}>LOGIN</Link>
        </nav>
      </header>
      
      <main style={{ position: 'relative', zIndex: 10 }}>
        <section style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 ref={titleRef} style={{ 
            fontSize: '4rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Digital Infrastructure
          </h1>
          <p ref={subtitleRef} style={{ 
            fontSize: '1.25rem', 
            color: '#94A3B8', 
            marginBottom: '3rem',
            fontFamily: 'var(--font-mono)'
          }}>
            :Unlock performance and unleash Business Innovation
          </p>
          <Link ref={btnRef} href="/login" style={{
            display: 'inline-block',
            padding: '1rem 3rem',
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'white';
          }}>
            Learn More
          </Link>
        </section>

        <section style={{ padding: '2rem 4rem 6rem' }}>
          <div ref={containerRef} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {services.map((service, i) => (
              <Link href="/login" key={i} className="service-card" style={{
                background: '#0B1120',
                border: '1px solid #1E293B',
                padding: '3rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
                }}>
                  <service.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{service.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '300px' }}>
                  {service.desc}
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  LEARN MORE <span style={{ fontFamily: 'var(--font-mono)' }}>{'>'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
