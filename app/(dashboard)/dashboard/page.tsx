'use client';

import { useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { incidents } from '@/lib/mock-data';
import { Shield, AlertTriangle, CheckCircle, Activity, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function DashboardPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.card');
      gsap.fromTo(cards,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
    
    // Seamless infinite scroll for Live Threat Stream
    if (feedRef.current) {
      gsap.to(feedRef.current, {
        y: '-50%',
        duration: 25,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);
  
  const tenantIncidents = incidents.filter(inc => inc.tenantId === tenant?.id);
  const openIncidents = tenantIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating');
  const highSeverity = tenantIncidents.filter(inc => inc.severity === 'high' && (inc.status === 'open' || inc.status === 'investigating'));

  // Threat Level Logic
  const threatLevel = highSeverity.length > 2 ? 'HIGH' : highSeverity.length > 0 ? 'ELEVATED' : 'GUARDED';
  const threatColor = threatLevel === 'HIGH' ? 'var(--risk-high)' : threatLevel === 'ELEVATED' ? 'var(--risk-medium)' : 'var(--risk-low)';

  const stats = [
    { name: 'Active Threats', value: highSeverity.length, icon: ShieldAlert, color: 'var(--risk-high)' },
    { name: 'Open Incidents', value: openIncidents.length, icon: AlertTriangle, color: 'var(--risk-medium)' },
    { name: 'System Nodes', value: '24', icon: Cpu, color: 'var(--primary)' },
    { name: 'Resolved (24h)', value: '18', icon: CheckCircle, color: 'var(--risk-low)' },
  ];

  return (
    <DashboardLayout title="SOC Control Center">
      <div ref={containerRef}>
        
        {/* Top Control Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', marginBottom: '1rem' }}>
          
          {/* Threat Level Indicator */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '1rem' }}>Threat Level</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="status-dot" style={{ backgroundColor: threatColor, width: '12px', height: '12px' }}></div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: threatColor, letterSpacing: '0.05em' }}>{threatLevel}</h2>
            </div>
          </div>

          {/* Metric Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {stats.map((stat) => (
              <div key={stat.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: `2px solid ${stat.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.name}</p>
                  <stat.icon size={16} color={stat.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h4 className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid Section: Activity Feed & Risk Score */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          
          {/* Threat Activity Feed */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
              <Terminal size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>LIVE THREAT STREAM</h3>
              <div className="status-dot" style={{ backgroundColor: 'var(--risk-low)', marginLeft: 'auto' }}></div>
            </div>
            
            <div 
              style={{ height: '300px', overflow: 'hidden', background: 'var(--bg-dark-card)', position: 'relative' }}
              onMouseEnter={() => gsap.globalTimeline.pause()}
              onMouseLeave={() => gsap.globalTimeline.play()}
            >
              <div ref={feedRef} style={{ position: 'absolute', width: '100%' }}>
                {/* Duplicate the array twice for seamless infinite scrolling */}
                {[...tenantIncidents, ...tenantIncidents].map((inc, i) => (
                  <div key={`${inc.id}-${i}`} style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    padding: '0.75rem', 
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>{new Date(inc.timestamp).toISOString().split('T')[1].slice(0,8)}</span>
                    <span style={{ 
                      color: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)',
                      width: '60px'
                    }}>[{inc.severity.toUpperCase()}]</span>
                    <span style={{ color: 'var(--text-primary)' }}>{inc.title} - {inc.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-dark)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, width: '100%', textAlign: 'left', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>System Health</h3>
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
              <svg width="180" height="180" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--bg-card)" strokeWidth="8" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--risk-low)" strokeWidth="8" strokeDasharray="502" strokeDashoffset="50" strokeLinecap="square" />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-low)' }}>90%</span>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>OPTIMAL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Log Style Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-dark)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} /> Incident Logs
            </h3>
            <Link href="/incidents" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>View All</Link>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Details</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tenantIncidents.slice(0, 5).map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(inc.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="status-dot" style={{ 
                        backgroundColor: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)',
                        animation: inc.severity === 'high' ? 'pulse-ring 2s infinite' : 'none'
                      }}></div>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>{inc.severity.toUpperCase()}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{inc.title}</p>
                    <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID:{inc.id} | CAT:{inc.category}</p>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ 
                      padding: '0.125rem 0.5rem', 
                      border: `1px solid ${inc.status === 'open' ? 'var(--risk-high)' : inc.status === 'investigating' ? 'var(--risk-medium)' : 'var(--border-focus)'}`,
                      color: inc.status === 'open' ? 'var(--risk-high)' : inc.status === 'investigating' ? 'var(--risk-medium)' : 'var(--text-muted)',
                      borderRadius: '2px', 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
