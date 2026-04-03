'use client';

import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { incidents, assets } from '@/lib/mock-data';
import { 
  Radar, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Cpu,
  Clock,
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
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
      );
    }
    if (feedRef.current) {
      gsap.to(feedRef.current, { y: '-50%', duration: 30, ease: 'none', repeat: -1 });
    }
    const timer = setInterval(() => {
      setLastUpdated(`${Math.floor(Math.random() * 5) + 1}s ago`);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const tenantIncidents = incidents.filter(inc => inc.tenantId === tenant?.id);
  const tenantAssets   = assets.filter(ast => ast.tenantId === tenant?.id);
  const openIncidents  = tenantIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating');
  const highSeverity   = tenantIncidents.filter(inc => inc.severity === 'high' && (inc.status === 'open' || inc.status === 'investigating'));
  const compromised    = tenantAssets.filter(ast => ast.status === 'compromised');

  const threatLevel = highSeverity.length > 2 ? 'HIGH' : highSeverity.length > 0 ? 'ELEVATED' : 'GUARDED';
  const threatColor = threatLevel === 'HIGH' ? 'var(--risk-high)' : threatLevel === 'ELEVATED' ? 'var(--risk-medium)' : 'var(--risk-low)';

  const sevColor  = (s: string) => s === 'high' ? 'var(--risk-high)' : s === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)';
  const sevBorder = (s: string) => s === 'high' ? '3px solid var(--risk-high)' : s === 'medium' ? '3px solid var(--risk-medium)' : '3px solid var(--risk-low)';
  const sevBg     = (s: string) => s === 'high' ? 'rgba(239,68,68,0.06)' : s === 'medium' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)';

  const stats = [
    { name: 'Active Threats',  value: highSeverity.length,  icon: ShieldAlert, color: 'var(--risk-high)' },
    { name: 'Open Incidents',  value: openIncidents.length, icon: AlertTriangle, color: 'var(--risk-medium)' },
    { name: 'System Nodes',    value: tenantAssets.length,  icon: Cpu, color: 'var(--primary)' },
    { name: 'Compromised',     value: compromised.length,   icon: Activity, color: compromised.length > 0 ? 'var(--risk-high)' : 'var(--text-muted)', pulse: compromised.length > 0 },
  ] as { name: string; value: number; icon: React.ElementType; color: string; pulse?: boolean }[];

  return (
    <DashboardLayout title="Ostec Control Center">
      <div ref={containerRef} className="grid-bg" style={{ padding: '0.5rem' }}>

        {/* ── Compromise Banner ── */}
        {compromised.length > 0 && (
          <div className="card log-row-alert threat-high-tint" style={{
            marginBottom: '0.75rem', padding: '0.5rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap'
          }}>
            <span className="status-dot animate-pulse" style={{ background: 'var(--risk-high)', width: 10, height: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--risk-high)', textTransform: 'uppercase' }}>SYSTEM COMPROMISE DETECTED</p>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{compromised.length} host{compromised.length > 1 ? 's' : ''} showing active signs of compromise</p>
            </div>
            <Link href="/assets" className="btn btn-primary" style={{ background: 'var(--risk-high)', fontSize: '0.6rem', padding: '0.25rem 0.6rem', borderRadius: 2, flexShrink: 0 }}>ISOLATE</Link>
          </div>
        )}

        {/* ══════════════════════════════════════════
            OUTER 2-COL GRID:  left = main | right = side panel
            On mobile everything stacks (1fr)
        ═══════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',   /* mobile: 1 col */
          gap: '0.75rem',
        }} className="dashboard-outer-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>

            {/* Row A: Threat card + 4 Metric cards side by side */}
            <div style={{
              display: 'grid',
              gap: '0.5rem',
              gridTemplateColumns: 'auto 1fr',   /* threat card | metrics */
            }} className="top-row-grid">

              {/* Threat Card */}
              <div className="card log-row-alert" style={{
                padding: '0.9rem 1rem', background: 'var(--bg-dark-card)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 140,
              }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Infra Status</p>
                <h2 style={{ fontSize: '1rem', fontWeight: 900, color: threatColor, margin: '0.3rem 0', letterSpacing: '0.02em' }}>
                  THREAT: {threatLevel}
                </h2>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={11} /> {lastUpdated}
                </p>
              </div>

              {/* 4 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
              }} className="metrics-grid">
                {stats.map((stat) => (
                  <div key={stat.name} className="card" style={{
                    padding: '0.65rem 0.75rem', background: 'var(--bg-dark-card)',
                    display: 'flex', flexDirection: 'column', gap: '0.2rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.3 }}>{stat.name}</p>
                      <stat.icon size={13} color={stat.color} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</span>
                      {stat.pulse && <span className="status-dot animate-pulse" style={{ background: 'var(--risk-high)', width: 6, height: 6 }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row B: Live Telemetry feed */}
            <div className="card" style={{ padding: 0, background: 'var(--bg-dark-card)', overflow: 'hidden' }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>● LIVE TELEMETRY</h3>
                <span className="animate-pulse-slow" style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>COLLECTING...</span>
              </div>
              <div
                style={{ height: 200, overflow: 'hidden', position: 'relative' }}
                onMouseEnter={() => gsap.globalTimeline.pause()}
                onMouseLeave={() => gsap.globalTimeline.play()}
              >
                <div ref={feedRef} style={{ position: 'absolute', width: '100%' }}>
                  {[...tenantIncidents, ...tenantIncidents].map((inc, i) => (
                    <div key={`${inc.id}-${i}`}
                      className={`severity-border-${inc.severity}`}
                      style={{ display: 'flex', gap: '0.75rem', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: 64 }}>{new Date(inc.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                      <span style={{ color: sevColor(inc.severity), fontWeight: 900, flexShrink: 0, width: 54 }}>{inc.severity.toUpperCase()}</span>
                      <span style={{ color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{inc.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row C: Incident Ledger — scrollable table, no overflow hidden on outer card */}
            <div className="card" style={{ padding: 0, background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.35rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={10} /> Incident Ledger
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: 800 }}>
                    <Clock size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {lastUpdated}
                  </span>
                  <Link href="/incidents" className="btn btn-outline" style={{ fontSize: '0.5rem', padding: '0.15rem 0.4rem', borderRadius: 2 }}>FULL LOGS</Link>
                </div>
              </div>

              {/* KEY FIX: overflow-x:auto on THIS div, NOT hidden on parent card */}
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                      {['Timestamp', 'Sev', 'Risk', 'Telemetry Event', 'Status'].map(h => (
                        <th key={h} style={{ padding: '0.4rem 0.6rem', fontSize: '0.55rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tenantIncidents.slice(0, 5).map((inc) => (
                      <tr key={inc.id}
                        className={`hover-high-density log-row-${inc.severity === 'high' ? 'alert' : inc.severity === 'medium' ? 'processing' : 'secure'}`}
                        style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="font-mono" style={{ padding: '0.3rem 0.6rem', fontSize: '0.6rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(inc.timestamp).toISOString().slice(11, 19)}
                        </td>
                        <td style={{ padding: '0.3rem 0.6rem', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.6rem', color: sevColor(inc.severity), fontWeight: 900 }}>{inc.severity.toUpperCase()}</span>
                        </td>
                        <td className="font-mono" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem', fontWeight: 900, whiteSpace: 'nowrap', color: inc.riskScore && inc.riskScore > 70 ? 'var(--risk-high)' : 'var(--text-primary)' }}>
                          {inc.riskScore ?? '--'}
                        </td>
                        <td style={{ padding: '0.3rem 0.6rem', minWidth: 180 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-primary)', display: 'block' }}>{inc.title}</span>
                          <span className="font-mono" style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>ID: {inc.id}</span>
                        </td>
                        <td style={{ padding: '0.3rem 0.6rem', whiteSpace: 'nowrap' }}>
                          <span className={`status-pill status-pill-${inc.status === 'open' ? 'alert' : inc.status === 'investigating' ? 'processing' : 'secure'}`}>
                            {inc.status === 'investigating' && <span className="status-dot animate-pulse" style={{ background: 'currentColor', width: 4, height: 4, position: 'static' }} />}
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

          {/* ── RIGHT COLUMN (side panel) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }} className="side-panel">

            {/* Integrity Ring — enlarged for better visibility */}
            <div className="card" style={{ padding: '1rem', background: 'var(--bg-dark-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Integrity</h3>
                <span style={{ fontSize: '0.6rem', color: 'var(--risk-low)', fontWeight: 800 }}>● ACTIVE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" opacity="0.2" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-low)"    strokeWidth="10" strokeDasharray="210 263" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-medium)" strokeWidth="10" strokeDasharray="30 263"  strokeDashoffset="-215" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--risk-high)"   strokeWidth="10" strokeDasharray="10 263"  strokeDashoffset="-250" />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>90%</span>
                    <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>INTEGRITY</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                  {[
                    { l: '21 Nodes Online', c: 'var(--risk-low)' },
                    { l: '2 Degraded', c: 'var(--risk-medium)' },
                    { l: '1 Offline', c: 'var(--risk-high)' }
                  ].map(i => (
                    <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: i.c, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{i.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network Intel */}
            <div className="card" style={{ padding: 0, background: 'var(--bg-dark-card)', overflow: 'hidden' }}>
              <div style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-light)' }}>
                <h3 style={{ fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Radar size={10} className="animate-pulse" /> NETWORK INTEL
                </h3>
              </div>
              <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {tenantIncidents.slice(0, 4).map((inc) => (
                  <div key={`side-${inc.id}`} style={{
                    padding: '0.4rem 0.5rem',
                    borderLeft: sevBorder(inc.severity),
                    background: sevBg(inc.severity),
                    borderRadius: 2,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{inc.id}</span>
                      <span style={{ fontSize: '0.55rem', color: sevColor(inc.severity), fontWeight: 900 }}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{inc.title}</p>
                  </div>
                ))}
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.55rem', padding: '0.2rem', borderRadius: 2, marginTop: '0.1rem' }}>FORENSICS DEPOT</button>
              </div>
            </div>

            {/* Advisory */}
            <div className="card" style={{ padding: '0.6rem', background: 'var(--primary-light)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <h4 style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Active Advisory</h4>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.4, fontWeight: 600 }}>
                Detected horizontal port scanning from unknown origin. Hardening internal subnets.
              </p>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
