'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { tenants, users } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

const CyberAura = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rings = containerRef.current.querySelectorAll('.aura-ring');
    gsap.to(rings, {
      scale: 1.05,
      opacity: 0.85,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.4
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 30% 30%, rgba(17,217,26,0.15), transparent 45%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.12), transparent 55%), linear-gradient(135deg, #07101f 0%, #040914 100%)'
      }}
    >
      <div className="aura-ring" style={ringStyle(180, '#11D91A')} />
      <div className="aura-ring" style={ringStyle(260, '#3B82F6')} />
      <div className="aura-ring" style={ringStyle(340, '#10B981')} />
      <div style={gridStyle} />
      <div style={shieldStyle}>
        <div style={shieldInnerStyle}>OS</div>
      </div>
    </div>
  );
};

const ringStyle = (size: number, color: string): React.CSSProperties => ({
  position: 'absolute',
  inset: '50%',
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: `-${size / 2}px`,
  marginTop: `-${size / 2}px`,
  border: `1px solid ${color}33`,
  borderRadius: '50%',
  boxShadow: `0 0 35px ${color}44`,
  filter: 'blur(0.2px)'
});

const gridStyle: React.CSSProperties = {
  position: 'absolute',
  inset: '12%',
  border: '1px solid rgba(255,255,255,0.06)',
  backgroundImage: 'linear-gradient(transparent 90%, rgba(255,255,255,0.05) 90%), linear-gradient(90deg, transparent 90%, rgba(255,255,255,0.05) 90%)',
  backgroundSize: '40px 40px',
  maskImage: 'radial-gradient(ellipse at center, white 70%, transparent 100%)'
};

const shieldStyle: React.CSSProperties = {
  position: 'absolute',
  inset: '50%',
  width: '110px',
  height: '130px',
  marginLeft: '-55px',
  marginTop: '-65px',
  background: 'linear-gradient(180deg, rgba(17,217,26,0.25), rgba(59,130,246,0.2))',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '16px 16px 28px 28px',
  boxShadow: '0 0 25px rgba(17,217,26,0.35), inset 0 0 20px rgba(59,130,246,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  letterSpacing: '0.1em',
  fontWeight: 700,
  color: '#e5fdf0',
  textShadow: '0 0 8px rgba(17,217,26,0.6)'
};

const shieldInnerStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.25)',
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(0,0,0,0.35)'
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcode fallback mock user just in case auth logic changed
    const fallbackUser = users[0];
    const user = users.find(u => u.email === email) || fallbackUser; // Auto-fallback for demo
    const tenant = tenants.find(t => t.id === user.tenantId) || tenants[0];
    
    dispatch(login({ user, tenant }));
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#040914', // Very dark blue/black
      overflow: 'hidden'
    }}>
      {/* LEFT PANE - Cyber Art */}
      <div
        className="login-hero-pane"
        style={{
          flex: '1',
          position: 'relative',
        }}
      >
        {/* Logo at top left */}
        <div style={{ position: 'absolute', top: '3rem', left: '3rem', zIndex: 10 }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
            <img src="/logo.svg" alt="Ostec Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          </Link>
        </div>
        
        <CyberAura />
      </div>

      {/* RIGHT PANE - Simple Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        borderLeft: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '2.5rem' }}>
            Ostec Identity System
          </h2>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yours@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid #1E293B',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  borderRadius: '2px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#11D91A'}
                onBlur={(e) => e.target.style.borderColor = '#1E293B'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid #1E293B',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  borderRadius: '2px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#11D91A'}
                onBlur={(e) => e.target.style.borderColor = '#1E293B'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <a href="#" style={{ fontSize: '0.75rem', color: '#3B82F6', textDecoration: 'none' }}>Don't remember your password?</a>
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: '#0ea5e9', 
              color: 'white',
              border: 'none',
              fontSize: '0.875rem', 
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0284c7'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0ea5e9'}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
