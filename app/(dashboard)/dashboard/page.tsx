'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { incidents, assets } from '@/lib/mock-data';
import { 
  Radar, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Terminal, 
  ShieldAlert, 
  Cpu,
  Monitor,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function DashboardPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [lastUpdated, setLastUpdated] = useState('2s ago');

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.card');
      gsap.fromTo(cards,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
    
    if (feedRef.current) {
      gsap.to(feedRef.current, {
        y: '-50%',
        duration: 35,
        ease: 'none',
        repeat: -1
      });
    }

    const timer = setInterval(() => {
      const seconds = Math.floor(Math.random() * 5) + 1;
      setLastUpdated(`${seconds}s ago`);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  
  const tenantIncidents = incidents.filter(inc => inc.tenantId === tenant?.id);
  const tenantAssets = assets.filter(ast => ast.tenantId === tenant?.id);
  
  const openIncidents = tenantIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating');
  const highSeverity = tenantIncidents.filter(inc => inc.severity === 'high' && (inc.status === 'open' || inc.status === 'investigating'));
  const compromisedAssets = tenantAssets.filter(ast => ast.status === 'compromised');

  const threatLevel = highSeverity.length > 2 ? 'HIGH' : highSeverity.length > 0 ? 'ELEVATED' : 'GUARDED';
  const threatColor = threatLevel === 'HIGH' ? 'var(--risk-high)' : threatLevel === 'ELEVATED' ? 'var(--risk-medium)' : 'var(--risk-low)';

  const stats = [
    { name: 'Active Threats', value: highSeverity.length, icon: ShieldAlert, color: 'var(--risk-high)', compromised: highSeverity.length > 0 },
    { name: 'Open Incidents', value: openIncidents.length, icon: AlertTriangle, color: 'var(--risk-medium)' },
    { name: 'System Nodes', value: tenantAssets.length, icon: Cpu, color: 'var(--primary)' },
    { name: 'Compromised', value: compromisedAssets.length, icon: Activity, color: compromisedAssets.length > 0 ? 'var(--risk-high)' : 'var(--text-muted)', pulse: compromisedAssets.length > 0 },
  ];

  return (
    <DashboardLayout title="Ostec Control Center">
      <div ref={containerRef} className="grid-bg" style={{ minHeight: 'calc(100vh - 100px)', padding: '0.75rem' }}>
        
        {/* Needs Attention / Critical Alert Section */}
        {compromisedAssets.length > 0 && (
          <div className="card threat-high-tint threat-pulse-glow" style={{ marginBottom: '1rem', border: '1px solid var(--risk-high)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="status-dot" style={{ backgroundColor: 'var(--risk-high)', width: '12px', height: '12px' }}></div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--risk-high)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urgent: System Compromise Detected</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                {compromisedAssets.length} host{compromisedAssets.length > 1 ? 's are' : ' is'} showing active signs of compromise. Immediate isolation recommended.
              </p>
            </div>
            <Link href="/assets" className="btn btn-primary" style={{ background: 'var(--risk-high)', fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>View Assets</Link>
          </div>
        )}

        <div className="grid-responsive-dashboard" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1rem' }}>
          
          {/* Main Dashboard Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Top Control Panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '1rem' }} className="grid-responsive-dashboard">
              
              {/* Threat Level Indicator */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', background: 'var(--bg-dark-card)', border: `1px solid ${threatColor}66`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: threatColor }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                   <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Security Status</p>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                     <Clock size={10} />
                     {lastUpdated}
                   </div>
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: threatColor, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>THREAT LEVEL: {threatLevel}</h2>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className={`status-dot ${threatLevel === 'HIGH' ? 'animate-pulse' : 'animate-pulse-slow'}`} style={{ backgroundColor: threatColor, width: '6px', height: '6px' }}></span>
                  SYSTEM UNDER {threatLevel === 'HIGH' ? 'ELEVATED' : 'GUARDED'} RISK
                </p>
              </div>

              {/* Metric Blocks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }} className="grid-responsive-metrics">
                {stats.map((stat) => (
                  <div key={stat.name} className={`card ${stat.pulse ? 'threat-pulse-glow' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem', background: 'var(--bg-dark-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.name}</p>
                      <stat.icon size={12} color={stat.color} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <h4 className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</h4>
                      {stat.pulse && <span className="status-dot" style={{ backgroundColor: 'var(--risk-high)', width: '6px', height: '6px' }}></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid Section: Activity Feed & Risk Score */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '1rem' }} className="grid-responsive-dashboard">
              
              {/* Threat Activity Feed */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                  <div className="status-dot" style={{ backgroundColor: 'var(--risk-low)', width: '6px', height: '6px' }}></div>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>LIVE THREAT STREAM</h3>
                  <div className="animate-pulse-slow" style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Streaming...
                  </div>
                </div>
                
                <div 
                  style={{ height: '220px', overflow: 'hidden', position: 'relative' }}
                  onMouseEnter={() => gsap.globalTimeline.pause()}
                  onMouseLeave={() => gsap.globalTimeline.play()}
                >
                  <div ref={feedRef} style={{ position: 'absolute', width: '100%' }}>
                    {[...tenantIncidents, ...tenantIncidents].map((inc, i) => (
                      <div key={`${inc.id}-${i}`} className={`severity-border-${inc.severity}`} style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
                        padding: '0.4rem 0.75rem', 
                        borderBottom: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ color: 'var(--text-muted)', width: '60px' }}>{new Date(inc.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                        <span style={{ 
                          color: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)',
                          width: '45px',
                          fontWeight: 700
                        }}>{inc.severity.toUpperCase()}</span>
                        <span style={{ color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inc.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Integrity (Segmented Ring) */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-dark-card)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>System Integrity</h3>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Scan</div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" opacity="0.3" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-low)" strokeWidth="8" strokeDasharray="180 263" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-medium)" strokeWidth="8" strokeDasharray="40 263" strokeDashoffset="-185" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-high)" strokeWidth="8" strokeDasharray="20 263" strokeDashoffset="-230" />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>90%</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[
                      { label: 'Online Nodes', color: 'var(--risk-low)', count: 21 },
                      { label: 'Degraded', color: 'var(--risk-medium)', count: 2 },
                      { label: 'Offline', color: 'var(--risk-high)', count: 1 }
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: item.color }}></div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.count} {item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Log Style Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={12} /> Incident Ledger
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={10} />
                    Sync: {lastUpdated}
                  </div>
                  <Link href="/incidents" className="btn btn-outline" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>Full Registry</Link>
                </div>
              </div>
              
              <div className="responsive-table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="table-min-width">
                  <thead>
                    <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timestamp</th>
                      <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
                      <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Score</th>
                      <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Descriptor</th>
                      <th style={{ padding: '0.5rem 0.75rem', fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantIncidents.slice(0, 5).map((inc) => (
                      <tr key={inc.id} className="hover-high-density" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}>
                        <td className="font-mono" style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {new Date(inc.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div className={inc.severity === 'high' ? 'status-dot animate-pulse' : ''} style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%',
                              backgroundColor: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)',
                            }}></div>
                            <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-primary)', fontWeight: 700 }}>{inc.severity.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="font-mono" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', fontWeight: 800, color: inc.riskScore && inc.riskScore > 70 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                          {inc.riskScore || '--'}
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-primary)' }}>{inc.title}</span>
                             <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>ID: {inc.id}</span>
                           </div>
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>
                          <span style={{ 
                            padding: '0.1rem 0.3rem', 
                            border: `1px solid var(--border)`,
                            color: inc.status === 'open' ? 'var(--risk-high)' : 'var(--text-muted)',
                            borderRadius: '2px', 
                            fontSize: '0.55rem', 
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: inc.status === 'open' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
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
          </div>

          {/* Right Side Panel: Active Threat Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hide-on-mobile">
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Radar size={12} className="animate-pulse" /> THREAT FEED
                </h3>
              </div>
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                 {tenantIncidents.slice(0, 6).map((inc, i) => (
                   <div key={`side-${inc.id}`} className={inc.severity === 'high' ? 'threat-high-tint' : ''} style={{ 
                     padding: '0.6rem', 
                     background: 'var(--bg-light)', 
                     borderRadius: '4px', 
                     borderLeft: `3px solid ${inc.severity === 'high' ? 'var(--risk-high)' : 'var(--border)'}`,
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '0.2rem'
                   }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{inc.id}</span>
                        <span style={{ fontSize: '0.55rem', color: inc.severity === 'high' ? 'var(--risk-high)' : 'var(--text-muted)', fontWeight: 800 }}>{inc.severity.toUpperCase()}</span>
                     </div>
                     <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{inc.title}</p>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                        <ExternalLink size={8} color="var(--text-muted)" />
                     </div>
                   </div>
                 ))}
                 <button className="btn btn-outline" style={{ marginTop: '0.4rem', width: '100%', fontSize: '0.6rem', padding: '0.3rem' }}>Network Forensics</button>
              </div>
            </div>
            
            <div className="card" style={{ padding: '0.75rem', background: 'var(--primary-light)', border: '1px solid var(--primary)22' }}>
               <h4 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Security Advisory</h4>
               <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                 Increased credential stuffing detected. Enforce MFA for all privileged accounts.
               </p>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

