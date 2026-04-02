'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { tenants, users } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

// Generates random green pixels around the canvas to mimic the uploaded exabeam image
const PixelArt = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const pixels = containerRef.current.children;
    gsap.fromTo(pixels, 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: () => 0.5 + Math.random() * 0.5, 
        scale: 1,
        duration: 1.5, 
        stagger: 0.05, 
        ease: 'power2.out' 
      }
    );
    
    // Continuous subtle pulsing
    gsap.to(pixels, {
      opacity: () => 0.4 + Math.random() * 0.6,
      duration: () => 1 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.1
    });
  }, []);

  const createPixelGroup = (x: number, y: number, pattern: number[][]) => {
    return pattern.map((pos, i) => (
      <div key={`p-${x}-${y}-${i}`} style={{
        position: 'absolute',
        top: `${y + pos[1] * 20}px`,
        left: `${x + pos[0] * 20}px`,
        width: '20px',
        height: '20px',
        background: ['#175E19', '#1C9321', '#11D91A', '#0DCA16', '#218E25'][Math.floor(Math.random() * 5)],
      }} />
    ));
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Pattern 1 */}
      {createPixelGroup(150, 150, [[0,0], [1,0], [0,1], [1,1], [2,-1], [3,-2]])}
      {/* Pattern 2 */}
      {createPixelGroup(250, 450, [[0,0], [1,0], [-1,1], [0,1], [0,2], [1,2]])}
      {/* Pattern 3 */}
      {createPixelGroup(400, 300, [[0,0], [1,0], [1,1], [2,1], [2,2]])}
      {/* Scattered pixels */}
      {createPixelGroup(100, 350, [[0,0], [1,0]])}
      {createPixelGroup(300, 200, [[0,0]])}
      {createPixelGroup(450, 500, [[0,0]])}
    </div>
  );
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
      <div style={{
        flex: '1',
        position: 'relative',
        display: 'none',
        '@media (min-width: 768px)': {
          display: 'block'
        }
      }}>
        {/* Logo at top left */}
        <div style={{ position: 'absolute', top: '3rem', left: '3rem', zIndex: 10 }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em' }}>
            <span style={{ color: '#11D91A' }}>//</span> ShieldOS
          </Link>
        </div>
        
        <PixelArt />
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
            ShieldOS Identity System
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
