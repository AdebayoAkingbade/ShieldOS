'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { incidents, assets } from '@/lib/mock-data';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { tenant } = useAppSelector((state) => state.auth);
  
  const isNg = tenant?.slug === 'cbn-ng';

  const tenantIncidents = incidents.filter(inc => inc.tenantId === tenant?.id);
  const tenantAssets   = assets.filter(ast => ast.tenantId === tenant?.id);
  
  const openIncidents = tenantIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating').length;
  const resolvedIncidents = tenantIncidents.filter(inc => inc.status === 'resolved' || inc.status === 'closed').length;
  const atRiskAssets = tenantAssets.filter(a => a.status === 'compromised' || a.status === 'degraded' || a.riskScore > 50).length;
  const totalAssets = tenantAssets.length;
  
  // Calculate average risk score
  const avgRiskScore = Math.floor(tenantIncidents.reduce((acc, inc) => acc + (inc.riskScore || 0), 0) / (tenantIncidents.filter(i => i.riskScore).length || 1));
  const finalRiskScore = avgRiskScore > 0 ? avgRiskScore : 74; // Fallback to 74 for visual match if none
  
  // Chart Mock Data
  const chartData = [
    { name: 'Mon', score: finalRiskScore - 15 },
    { name: 'Tue', score: finalRiskScore - 10 },
    { name: 'Wed', score: finalRiskScore - 5 },
    { name: 'Thu', score: finalRiskScore + 5 },
    { name: 'Fri', score: finalRiskScore },
    { name: 'Sat', score: finalRiskScore + 2 },
    { name: 'Sun', score: finalRiskScore },
  ];

  const complianceData = isNg ? [
    { title: 'CBN Cyber Framework', subtitle: 'Nigeria - Financial', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'NDPR', subtitle: 'Nigeria - All sectors', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'NITDA', subtitle: 'Nigeria - All sectors', status: 'At risk', color: 'var(--risk-medium)', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'ISO 27001:2022', subtitle: 'Global - All sectors', status: 'Compliant', color: 'var(--risk-low)', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'PCI DSS v4.0', subtitle: 'Global - Payments', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
  ] : [
    { title: 'BoG CISD 2026', subtitle: 'Ghana - Financial', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Ghana Data Protection', subtitle: 'Ghana - All sectors', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Ghana CSA', subtitle: 'Ghana - All sectors', status: 'At risk', color: 'var(--risk-medium)', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'ISO 27001:2022', subtitle: 'Global - All sectors', status: 'Compliant', color: 'var(--risk-low)', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'PCI DSS v4.0', subtitle: 'Global - Payments', status: 'Non-compliant', color: 'var(--risk-high)', bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  const bannerText = isNg 
    ? "NDPR / CBN Framework — Mandatory reporting deadline active"
    : "BoG CISD — Mandatory reporting deadline active";
    
  // Asset groupings
  const servers = tenantAssets.filter(a => a.type === 'server');
  const endpoints = tenantAssets.filter(a => a.type === 'endpoint');
  const databases = tenantAssets.filter(a => a.type === 'database');

  return (
    <DashboardLayout title="SOC Control Center">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* ── ALERTS BANNER ── */}
      <div style={{ background: '#3b0a0a', border: '1px solid #7f1d1d', borderRadius: '4px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--risk-high)', marginTop: '6px', flexShrink: 0 }} className="threat-pulse-glow" />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fca5a5', margin: 0 }}>{bannerText}</h4>
            <p style={{ fontSize: '0.75rem', color: '#fecaca', margin: 0, opacity: 0.8 }}>Core banking incident requires regulatory notification. SOC report prepared — awaiting your sign-off.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171' }}>13h 42m</span>
          <Link href="/incidents" style={{ color: '#fca5a5', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>Review →</Link>
        </div>
      </div>

      {/* ── TOP METRICS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1rem' }}>
        
        {/* Left Big Card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark-card)' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>BUSINESS RISK SCORE</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem 0' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--risk-high)', lineHeight: 1 }}>{finalRiskScore}</h1>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--risk-high)' }}>HIGH RISK</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--risk-high)', margin: '0.25rem 0' }}>↑ 8 pts from last month</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>3 unresolved HIGH incidents</span>
          </div>
          
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Est. exposure</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--risk-medium)' }}>
              {isNg ? 'NGN 900M - 1.8B' : 'GHS 12M - 24M'}
            </p>
            <div style={{ height: '50px', width: '100%', marginTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--risk-high)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--risk-high)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'none', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="score" stroke="var(--risk-high)" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)', position: 'relative' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-high)', margin: 0, lineHeight: 1.1 }}>{openIncidents}</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>OPEN INCIDENTS</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--risk-high)', fontWeight: 600 }}>3 require your approval</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-medium)', margin: 0, lineHeight: 1.1 }}>{atRiskAssets}</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>ASSETS AT RISK</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--risk-medium)', fontWeight: 600 }}>↑ 4 since last week</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-low)', margin: 0, lineHeight: 1.1 }}>{resolvedIncidents}</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>RESOLVED BY SOC (24H)</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--risk-low)', fontWeight: 600 }}>Avg response: 84 min</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0, lineHeight: 1.1 }}>{totalAssets}</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>TOTAL ASSETS MONITORED</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Full coverage active</p>
          </div>

        </div>
      </div>

      {/* ── REGULATORY COMPLIANCE ── */}
      <div>
        <h3 style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>REGULATORY COMPLIANCE — CLICK ANY FRAMEWORK FOR DETAIL</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
          {complianceData.map(c => (
            <div key={c.title} className="card" style={{ padding: '1rem', background: 'var(--bg-dark-card)' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, margin: 0 }}>{c.title}</h4>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{c.subtitle}</p>
              <div style={{ display: 'inline-flex', padding: '0.2rem 0.5rem', borderRadius: '4px', background: c.bg, color: c.color, fontSize: '0.65rem', fontWeight: 800 }}>
                {c.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SOC ACTIVITY ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-dark-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>SOC activity — what your team has done</h3>
          <Link href="/incidents" style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none' }}>View full activity →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {tenantIncidents.slice(0, 3).map((inc, i) => (
             <div key={inc.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inc.severity === 'high' ? 'var(--risk-high)' : inc.severity === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)', marginTop: '4px', flexShrink: 0 }} />
               <div>
                 <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.4 }}>{inc.title}</p>
                 <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: '0.3rem 0', fontFamily: 'var(--font-mono)' }}>
                   {new Date(inc.timestamp).toLocaleString()} — {inc.status}
                 </p>
                 {inc.severity === 'high' && i === 0 && (
                   <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>{bannerText.split('—')[0].trim()} §14 — 13h 42m to file</span>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* ── ASSET LISTING ── */}
      {/* <div>
         <h3 style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>ASSET COVERAGE DEMO</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Servers — {servers.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {servers.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Endpoints — {endpoints.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {endpoints.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-dark-card)' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Databases — {databases.length}</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr>
                       {['Name', 'IP', 'Criticality', 'Status', 'Last Seen', 'Source Tool'].map(h => (
                         <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {databases.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: s.criticality === 'High' ? 'var(--risk-high)' : s.criticality === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>{s.criticality}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                           <span className={`status-pill status-pill-${s.status === 'compromised' ? 'alert' : s.status === 'degraded' ? 'processing' : 'secure'}`}>
                             {s.status}
                           </span>
                         </td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                         <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{s.sourceTool}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

         </div>
      </div> */}

    </div>
    </DashboardLayout>
  );
}
